import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { allowedOrigins, env } from './config/env';
import { swaggerSpec } from './docs/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/security';
import { apiRouter } from './routes';
import { logger } from './utils/logger';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(pinoHttp({ logger }));
app.use(apiRateLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use(`/api/${env.API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(`/api/${env.API_VERSION}`, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
