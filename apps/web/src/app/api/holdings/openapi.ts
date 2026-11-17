/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const holdingsPath = {
  '/api/holdings': {
    get: {
      summary: 'List holdings across portfolios',
      tags: ['holdings'],
      parameters: [{ name: 'portfolio', in: 'query', required: false, schema: { type: 'string' } }],
      responses: { '200': { description: 'Array of HoldingView' } },
    },
  },
} as const;
