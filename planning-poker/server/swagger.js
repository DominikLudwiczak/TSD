/**
 * OpenAPI Swagger Spec Setup (swagger.js)
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Planning Poker API',
      version: '1.0.0',
      description: 'API documentation for Planning Poker application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server'
      }
    ],
    components: {
      schemas: {
        Card: {
          type: 'object',
          required: ['value', 'displayValue', 'sortOrder'],
          properties: {
            _id: { type: 'string' },
            value: { type: 'string' },
            displayValue: { type: 'string' },
            sortOrder: { type: 'integer' },
            deckType: { type: 'string', enum: ['fibonacci', 'tshirt', 'custom'] },
          }
        },
        User: {
          type: 'object',
          required: ['username'],
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            displayName: { type: 'string' },
            role: { type: 'string', enum: ['developer', 'observer', 'moderator'] },
            createdAt: { type: 'string', format: 'date-time' },
            lastActive: { type: 'string', format: 'date-time' }
          }
        },
        Room: {
          type: 'object',
          required: ['name', 'creator'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            creator: { type: 'string' },
            deckType: { type: 'string' },
            participants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string' },
                  joinedAt: { type: 'string', format: 'date-time' },
                  isActive: { type: 'boolean' }
                }
              }
            },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        EstimationSession: {
          type: 'object',
          required: ['room'],
          properties: {
            _id: { type: 'string' },
            room: { type: 'string' },
            taskName: { type: 'string' },
            taskDescription: { type: 'string' },
            status: { type: 'string', enum: ['active', 'revealed', 'completed'] },
            finalEstimation: { type: 'string' },
            startedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time' },
            estimations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string' },
                  card: { type: 'string' },
                  estimatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
