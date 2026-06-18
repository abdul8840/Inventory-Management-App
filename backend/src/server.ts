import { app } from './app';
import { connectDatabase, DatabaseConnectionError } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`Inventory API listening on port ${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'Shutting down API');
    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  if (error instanceof DatabaseConnectionError) {
    logger.fatal(
      {
        message: error.message,
        details: error.details
      },
      'Failed to connect to MongoDB'
    );
    process.exit(1);
  }

  logger.fatal({ error }, 'Failed to start API');
  process.exit(1);
});
