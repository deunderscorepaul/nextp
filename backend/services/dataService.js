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
    try {
      logger.info('Fetching data from Craftplaces API...');
      
      const apiUrl = process.env.CRAFTPLACES_API_URL;
      const apiKey = process.env.CRAFTPLACES_API_KEY;
      
      if (!apiUrl) {
        throw new Error('CRAFTPLACES_API_URL not configured');
      }

      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'FoodTruckFinder/1.0'
        },
        timeout: 30000 // 30 second timeout
      });

      if (!response.data || !Array.isArray(response.data.result)) {
        throw new Error('Invalid API response format');
      }

      const trucks = response.data.result.map(truck => ({
        id: truck.id || `truck-${Date.now()}-${Math.random()}`,
        lat: truck.location?.position?.latitude || '0',
        long: truck.location?.position?.longitude || '0',
        name: truck.vendor?.company || 'Unknown Truck',
        offering: truck.vendor?.offer || [],
        payment: truck.vendor?.payments || [],
        describtion: truck.description || 'No description available',
        weekday: truck.date?.start?.date || new Date().toISOString().split('T')[0],
        imageURL: truck.logo?.url?.europe || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'
      }));

      logger.info(`Successfully fetched ${trucks.length} trucks from API`);
      return trucks;
    } catch (error) {
      logger.error('Failed to fetch from Craftplaces API:', error.message);
      
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
}

module.exports = new DataService();