import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public readonly details: string[],
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'DatabaseConnectionError';
  }
}

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    });
  } catch (error) {
    throw buildDatabaseConnectionError(error);
  }

  logger.info('MongoDB connection established');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

function buildDatabaseConnectionError(error: unknown) {
  const uriInfo = getMongoUriInfo(env.MONGODB_URI);
  const originalMessage = error instanceof Error ? error.message : 'Unknown MongoDB connection error';

  const details = [
    `MongoDB host: ${uriInfo.host || 'unknown'}`,
    `MongoDB database: ${uriInfo.database || 'not set in URI'}`,
    'If this is MongoDB Atlas, open Atlas > Network Access and add your current IP address.',
    'For local development, Atlas can temporarily allow 0.0.0.0/0, but restrict it before production.',
    'Confirm the database user exists and the username/password in MONGODB_URI are URL-encoded.',
    'Use a URI like mongodb+srv://<user>:<password>@<cluster>.mongodb.net/inventory_app?retryWrites=true&w=majority'
  ];

  return new DatabaseConnectionError(`MongoDB connection failed: ${originalMessage}`, details, { cause: error });
}

function getMongoUriInfo(uri: string) {
  try {
    const parsed = new URL(uri);

    return {
      host: parsed.host,
      database: parsed.pathname.replace(/^\//, '')
    };
  } catch {
    return {
      host: '',
      database: ''
    };
  }
}
