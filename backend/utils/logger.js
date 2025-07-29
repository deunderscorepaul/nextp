const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };

    return JSON.stringify(logEntry);
  }

  writeToFile(level, message, data = null) {
    const logFile = path.join(this.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message, data);
    
    fs.appendFileSync(logFile, formattedMessage + '\n');
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const colorCodes = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      success: '\x1b[32m', // Green
      reset: '\x1b[0m'     // Reset
    };

    const color = colorCodes[level] || colorCodes.reset;
    const resetColor = colorCodes.reset;

    // Console output with colors
    console.log(`${color}[${timestamp}] ${level.toUpperCase()}: ${message}${resetColor}`);
    
    if (data) {
      console.log(`${color}Data:${resetColor}`, data);
    }

    // Write to file (only in production or if explicitly enabled)
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGGING === 'true') {
      this.writeToFile(level, message, data);
    }
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  success(message, data = null) {
    this.log('success', message, data);
  }
}

module.exports = {
  logger: new Logger()
};