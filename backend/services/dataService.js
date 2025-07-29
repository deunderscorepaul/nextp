const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../utils/logger');

class DataService {
  constructor() {
    this.cacheFile = path.join(__dirname, '../data/trucks-cache.json');
    this.metaFile = path.join(__dirname, '../data/cache-meta.json');
    this.cacheDuration = (process.env.CACHE_DURATION_DAYS || 7) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    this.lastUpdateTime = null;
    this.trucksData = [];
  }

  async ensureDataDirectory() {
    const dataDir = path.dirname(this.cacheFile);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
      logger.info('Created data directory');
    }
  }

  async loadCachedData() {
    try {
      await this.ensureDataDirectory();
      
      // Load cache metadata
      try {
        const metaData = await fs.readFile(this.metaFile, 'utf8');
        const meta = JSON.parse(metaData);
        this.lastUpdateTime = new Date(meta.lastUpdate);
      } catch (error) {
        logger.warn('No cache metadata found');
      }

      // Load cached trucks data
      const cachedData = await fs.readFile(this.cacheFile, 'utf8');
      this.trucksData = JSON.parse(cachedData);
      
      logger.info(`Loaded ${this.trucksData.length} trucks from cache`);
      return this.trucksData;
    } catch (error) {
      logger.warn('No cached data found, will fetch fresh data');
      return [];
    }
  }

  async saveCachedData(data) {
    try {
      await this.ensureDataDirectory();
      
      // Save trucks data
      await fs.writeFile(this.cacheFile, JSON.stringify(data, null, 2));
      
      // Save metadata
      const meta = {
        lastUpdate: new Date().toISOString(),
        count: data.length,
        nextUpdate: new Date(Date.now() + this.cacheDuration).toISOString()
      };
      await fs.writeFile(this.metaFile, JSON.stringify(meta, null, 2));
      
      this.lastUpdateTime = new Date();
      this.trucksData = data;
      
      logger.info(`Cached ${data.length} trucks to disk`);
    } catch (error) {
      logger.error('Failed to save cached data:', error);
      throw error;
    }
  }

  isCacheValid() {
    if (!this.lastUpdateTime) return false;
    const now = new Date();
    const cacheAge = now - this.lastUpdateTime;
    return cacheAge < this.cacheDuration;
  }

  async fetchFromCraftplaces() {
    // Test mode - return mock data
    if (process.env.TEST_MODE === 'true') {
      logger.info('TEST MODE: Using mock data instead of API');
      return this.generateMockData();
    }

    try {
      logger.info('Fetching data from Craftplaces API...');
      
      const baseUrl = process.env.CRAFTPLACES_API_URL;
      
      if (!baseUrl) {
        throw new Error('CRAFTPLACES_API_URL and CRAFTPLACES_API_KEY must be configured with your actual API key');
      }

      
      const response = await axios.get(baseUrl, {
        timeout: 30000 // 30 second timeout
      });

      logger.info('Raw API response structure:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        hasResult: response.data && 'result' in response.data,
        resultType: response.data && response.data.result ? typeof response.data.result : 'undefined'
      });

      let trucksData;
      
      // Handle different possible response structures
      if (Array.isArray(response.data)) {
        trucksData = response.data;
      } else if (response.data && Array.isArray(response.data.result)) {
        trucksData = response.data.result;
      } else if (response.data && Array.isArray(response.data.data)) {
        trucksData = response.data.data;
      } else {
        logger.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response format - expected array of trucks');
      }

      const trucks = trucksData.map((truck, index) => {
        return {
          id: truck.id,
          lat: truck.location.position.latitude,
          long: truck.location.position.longitude,
          name: truck.vendor.company,
          offering: Array.isArray(truck.vendor.offer) ? truck.vendor.offer : [truck.vendor.offer],
          payment: truck.vendor.payments || [],
          describtion: truck.description || truck.vendor.offer || 'Delicious food truck',
          weekday: truck.date.start.date.split('T')[0], // Extract just the date part
          imageURL: truck.logo.url.europe || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'
        };
      });

      logger.info(`Successfully fetched ${trucks.length} trucks from API`);
      
      // Log a sample of the processed data
      if (trucks.length > 0) {
        logger.info('Sample processed truck:', {
          name: trucks[0].name,
          offerings: trucks[0].offering.slice(0, 3),
          payments: trucks[0].payment.slice(0, 3),
          date: trucks[0].weekday
        });
      }
      
      return trucks;
    } catch (error) {
      logger.error('Failed to fetch from Craftplaces API:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url?.replace(process.env.CRAFTPLACES_API_KEY || '', '[API_KEY]')
      });
      
      // If it's a network error and we have cached data, use that
      if (this.trucksData.length > 0) {
        logger.warn('Using stale cached data due to API error');
        return this.trucksData;
      }
      
      throw error;
    }
  }

  async getTrucks() {
    // Load cached data if we haven't already
    if (this.trucksData.length === 0) {
      await this.loadCachedData();
    }

    // If cache is valid, return cached data
    if (this.isCacheValid() && this.trucksData.length > 0) {
      logger.info('Serving data from cache');
      return this.trucksData;
    }

    // Cache is invalid or empty, fetch fresh data
    logger.info('Cache invalid or empty, fetching fresh data');
    return await this.refreshData();
  }

  async refreshData() {
    try {
      const freshData = await this.fetchFromCraftplaces();
      await this.saveCachedData(freshData);
      return freshData;
    } catch (error) {
      logger.error('Failed to refresh data:', error);
      
      // If we have any cached data, return it as fallback
      if (this.trucksData.length > 0) {
        logger.warn('Returning stale cached data as fallback');
        return this.trucksData;
      }
      
      throw error;
    }
  }

  getLastUpdateTime() {
    return this.lastUpdateTime;
  }

  getCacheStatus() {
    return {
      isValid: this.isCacheValid(),
      lastUpdate: this.lastUpdateTime,
      cacheAge: this.lastUpdateTime ? Date.now() - this.lastUpdateTime.getTime() : null,
      trucksCount: this.trucksData.length
    };
  }

  getNextUpdateTime() {
    if (!this.lastUpdateTime) return null;
    return new Date(this.lastUpdateTime.getTime() + this.cacheDuration);
  }

  generateMockData() {
    const mockTrucks = [
      {
        id: "test-1",
        lat: "49.4875",
        long: "11.1289",
        name: "KOCHSTOLZ",
        offering: ["SHAKSHUKA - unglaublich lecker !"],
        payment: ["pay_cash", "pay_creditcard", "pay_debitcard", "pay_apple", "pay_google"],
        describtion: "SHAKSHUKA - unglaublich lecker !",
        weekday: new Date().toISOString().split('T')[0],
        imageURL: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        id: "test-2",
        lat: "49.4856",
        long: "11.1266",
        name: "Pfundskerl",
        offering: ["Burger", "Pommes & mehr"],
        payment: ["pay_cash", "pay_creditcard", "pay_debitcard", "pay_paypal", "pay_apple", "pay_google"],
        describtion: "Burger, Pommes & mehr",
        weekday: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        imageURL: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        id: "test-3",
        lat: "49.4845",
        long: "11.1275",
        name: "Pizza Express",
        offering: ["Margherita", "Pepperoni", "Quattro Stagioni"],
        payment: ["pay_creditcard", "pay_debitcard", "pay_apple"],
        describtion: "Fresh wood-fired pizza made to order",
        weekday: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        imageURL: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ];

    // Generate trucks for the next week too
    const nextWeekTrucks = mockTrucks.map((truck, index) => ({
      ...truck,
      id: `${truck.id}-next-week`,
      weekday: new Date(Date.now() + (7 + index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    return [...mockTrucks, ...nextWeekTrucks];
  }
}

module.exports = new DataService();