/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const alertsPath = {
  '/api/alerts': {
    get: { summary: 'List price alerts', tags: ['alerts'], responses: { '200': { description: 'Array of PriceAlertView' } } },
    post: {
      summary: 'Create a price alert',
      tags: ['alerts'],
      responses: { '201': { description: 'Alert created' }, '404': { description: 'Unknown symbol' } },
    },
  },
} as const;
