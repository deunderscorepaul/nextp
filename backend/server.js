const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const dataService = require('./services/dataService');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4000',
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/trucks', async (req, res) => {
  try {
    const trucks = await dataService.getTrucks();
    
    res.json({
      success: true,
      data: trucks,
      cached: true,
      lastUpdated: dataService.getLastUpdateTime(),
      count: trucks.length
    });
  } catch (error) {
    logger.error('Error serving trucks data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve trucks data',
      message: error.message
    });
  }
});

app.get('/api/trucks/refresh', async (req, res) => {
  try {
    logger.info('Manual data refresh requested');
    const trucks = await dataService.refreshData();
    
    res.json({
      success: true,
      message: 'Data refreshed successfully',
      data: trucks,
      lastUpdated: dataService.getLastUpdateTime(),
      count: trucks.length
    });
  } catch (error) {
    logger.error('Error refreshing data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh data',
      message: error.message
    });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    lastDataUpdate: dataService.getLastUpdateTime(),
    cacheStatus: dataService.getCacheStatus(),
    nextScheduledUpdate: dataService.getNextUpdateTime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/trucks',
      'GET /api/trucks/refresh',
      'GET /api/status'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Schedule weekly data refresh (every Sunday at midnight)
const cronExpression = process.env.DATA_REFRESH_CRON || '0 0 * * 0';
cron.schedule(cronExpression, async () => {
  logger.info('Scheduled data refresh started');
  try {
    await dataService.refreshData();
    logger.info('Scheduled data refresh completed successfully');
  } catch (error) {
    logger.error('Scheduled data refresh failed:', error);
  }
});

// Initialize data on startup
async function initializeServer() {
  try {
    logger.info('Initializing server...');
    
    // Check if we have cached data, if not fetch it
    const trucks = await dataService.getTrucks();
    logger.info(`Server initialized with ${trucks.length} trucks in cache`);
    
    app.listen(PORT, () => {
      logger.info(`🚚 Food Truck Backend running on port ${PORT}`);
      logger.info(`📊 API endpoints available at http://localhost:${PORT}/api`);
      logger.info(`⏰ Data refresh scheduled: ${cronExpression}`);
    });
  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

initializeServer();