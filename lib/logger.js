import winston from 'winston';
import graylog from 'winston-graylog2';
import moment  from 'moment';
const logger = new(winston.Logger)({
  exitOnError: false,
  transports: [new winston.transports.Console({
    colorize: true,
    timestamp: () => {
      return `${moment(new Date()).format('DD/MM/YYYY HH:mm:ss.SSS')}`;
    }
  })]
});

if (process.env.NODE_ENV === 'production') {
  logger.add(graylog, {
    name: 'Graylog',
    prelog: (msg) => {
      return msg.trim();
    },
    graylog: {
      servers: [{
        host: '10.3.100.40', port: 12201
      }],
      facility: 'api.pomeo.ru',
      bufferSize: 1400
    }
  });
}

export default logger;
