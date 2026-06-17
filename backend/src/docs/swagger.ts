import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Inventory SaaS API',
      version: '1.0.0',
      description: 'Secure REST API for a multi-tenant inventory management mobile application.'
    },
    servers: [
      {
        url: `/api/${env.API_VERSION}`,
        description: 'Current API'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': { description: 'API is healthy' }
          }
        }
      },
      '/auth/session': {
        post: {
          summary: 'Exchange a Firebase ID token for an application JWT',
          security: [],
          responses: {
            '200': { description: 'Application session created' }
          }
        }
      },
      '/products': {
        get: {
          summary: 'List tenant-scoped products',
          responses: { '200': { description: 'Product list' } }
        },
        post: {
          summary: 'Create a product',
          responses: { '201': { description: 'Product created' } }
        }
      },
      '/products/{id}/stock': {
        post: {
          summary: 'Adjust inventory stock or record a sale',
          responses: { '200': { description: 'Product stock updated' } }
        }
      },
      '/analytics/dashboard': {
        get: {
          summary: 'Dashboard analytics',
          responses: { '200': { description: 'Dashboard metrics' } }
        }
      },
      '/reports/inventory.csv': {
        get: {
          summary: 'Export inventory as CSV',
          responses: { '200': { description: 'CSV export' } }
        }
      },
      '/reports/inventory.pdf': {
        get: {
          summary: 'Export inventory as PDF',
          responses: { '200': { description: 'PDF export' } }
        }
      }
    }
  },
  apis: []
});
