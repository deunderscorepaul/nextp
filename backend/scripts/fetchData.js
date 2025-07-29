#!/usr/bin/env node

/**
 * Manual data fetching script
 * Usage: npm run fetch-data
 */

const dataService = require('../services/dataService');
const { logger } = require('../utils/logger');

async function fetchData() {
  try {
    logger.info('🚀 Starting manual data fetch...');
    
    const trucks = await dataService.refreshData();
    
    logger.success(`✅ Successfully fetched and cached ${trucks.length} trucks`);
    logger.info(`📊 Data saved to cache, valid until: ${dataService.getNextUpdateTime()}`);
    
    // Display some sample data
    if (trucks.length > 0) {
      logger.info('📋 Sample truck data:');
      const sample = trucks.slice(0, 3).map(truck => ({
        name: truck.name,
        offerings: truck.offering.slice(0, 2),
        date: truck.weekday
      }));
      console.table(sample);
    }
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to fetch data:', error.message);
    process.exit(1);
  }
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚚 Food Truck Data Fetcher

Usage: npm run fetch-data [options]

Options:
  --help, -h    Show this help message
  
This script fetches fresh data from the Craftplaces API and caches it locally.
The cached data will be used by the server until the next scheduled refresh.
  `);
  process.exit(0);
}

fetchData();