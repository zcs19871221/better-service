import path from 'path';

export default {
  serverTimeout: 30 * 1000,
  port: 9478,
  errorContent: `<html>not found</html>`,
  isDevelopment: process.env.NODE_ENV === 'development',
  root: path.join(__dirname, '../'),
};
