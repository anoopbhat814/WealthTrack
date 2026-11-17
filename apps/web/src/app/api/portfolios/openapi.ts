/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const portfoliosPath = {
  '/api/portfolios': {
    get: {
      summary: 'List portfolios with holdings, valuation and day change',
      tags: ['portfolios'],
      responses: { '200': { description: 'Array of PortfolioSummary' } },
    },
    post: {
      summary: 'Create a portfolio',
      tags: ['portfolios'],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePortfolio' } } } },
      responses: { '201': { description: 'Created portfolio' }, '400': { description: 'Validation error' } },
    },
  },
} as const;
