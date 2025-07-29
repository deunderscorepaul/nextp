# Food Truck Backend

A Node.js backend service that fetches data from the Craftplaces API, caches it weekly, and serves it to the frontend application.

## Features

- 🔄 **Weekly Data Caching**: Automatically fetches and caches data every Sunday
- 🚀 **Fast API Responses**: Serves cached data for optimal performance
- 📊 **Health Monitoring**: Built-in health checks and status endpoints
- 🛡️ **Error Handling**: Graceful fallbacks and comprehensive error handling
- 📝 **Logging**: Structured logging with file output in production
- ⏰ **Scheduled Updates**: Configurable cron-based data refresh

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Fetch Initial Data** (optional)
   ```bash
   npm run fetch-data
   ```

## API Endpoints

### `GET /api/health`
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### `GET /api/trucks`
Get cached truck data
```json
{
  "success": true,
  "data": [...],
  "cached": true,
  "lastUpdated": "2024-01-15T00:00:00.000Z",
  "count": 25
}
```

### `GET /api/trucks/refresh`
Manually refresh data from API
```json
{
  "success": true,
  "message": "Data refreshed successfully",
  "data": [...],
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "count": 25
}
```

### `GET /api/status`
Get server and cache status
```json
{
  "server": "running",
  "lastDataUpdate": "2024-01-15T00:00:00.000Z",
  "cacheStatus": {
    "isValid": true,
    "lastUpdate": "2024-01-15T00:00:00.000Z",
    "cacheAge": 3600000,
    "trucksCount": 25
  },
  "nextScheduledUpdate": "2024-01-22T00:00:00.000Z"
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `CRAFTPLACES_API_URL` | Craftplaces API endpoint | Required |
| `CRAFTPLACES_API_KEY` | API authentication key | Required |
| `CACHE_DURATION_DAYS` | Cache validity in days | `7` |
| `DATA_REFRESH_CRON` | Cron expression for updates | `0 0 * * 0` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:4000` |

### Cron Schedule Examples

- `0 0 * * 0` - Every Sunday at midnight
- `0 2 * * 1` - Every Monday at 2 AM
- `0 0 */3 * *` - Every 3 days at midnight

## Data Flow

1. **Startup**: Server loads cached data if available
2. **Cache Check**: For each request, checks if cache is still valid
3. **Fresh Data**: If cache expired, fetches from Craftplaces API
4. **Fallback**: If API fails, serves stale cached data
5. **Scheduled Refresh**: Cron job updates cache weekly

## File Structure

```
backend/
├── data/                 # Cached data files
│   ├── trucks-cache.json # Truck data cache
│   └── cache-meta.json   # Cache metadata
├── logs/                 # Log files (production)
├── scripts/              # Utility scripts
│   └── fetchData.js      # Manual data fetching
├── services/             # Business logic
│   └── dataService.js    # Data management service
├── utils/                # Utilities
│   └── logger.js         # Logging utility
├── .env                  # Environment configuration
└── server.js             # Main server file
```

## Development

### Running in Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Manual Data Fetch
```bash
npm run fetch-data  # Fetch and cache data immediately
```

### Production Deployment
```bash
npm start  # Production server
```

## Error Handling

The service includes comprehensive error handling:

- **API Failures**: Falls back to cached data
- **Network Issues**: Retries with exponential backoff
- **Invalid Data**: Validates and sanitizes API responses
- **Cache Corruption**: Rebuilds cache from API

## Monitoring

- **Health Endpoint**: `/api/health` for load balancer checks
- **Status Endpoint**: `/api/status` for detailed monitoring
- **Structured Logs**: JSON format for log aggregation
- **Error Tracking**: Comprehensive error logging

## Security

- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Sanitizes all API inputs
- **Error Sanitization**: Hides sensitive info in production
- **Rate Limiting**: Ready for rate limiting middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details