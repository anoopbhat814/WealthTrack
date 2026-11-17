/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const forecastPath = {
  '/api/forecast': {
    post: {
      summary: 'Run a Monte Carlo projection via the forecast service',
      tags: ['forecast'],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ForecastRequest' } } } },
      responses: {
        '200': { description: 'ForecastResult with percentile bands' },
        '400': { description: 'Validation error' },
        '502': { description: 'Forecast service unavailable' },
      },
    },
  },
} as const;
