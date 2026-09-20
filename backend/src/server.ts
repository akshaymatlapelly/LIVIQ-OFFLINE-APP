import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`==================================================`);
  console.log(` SENTRIX Intelligence Core REST API Server`);
  console.log(` Status: ACTIVE`);
  console.log(` Listening on: http://localhost:${config.port}`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(`==================================================`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SENTRIX Server Unhandled Rejection]', promise, 'reason:', reason);
});

export default server;
