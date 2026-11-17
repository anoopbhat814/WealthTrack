/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const budgetsPath = {
  '/api/budgets': {
    get: {
      summary: 'List budgets with spend for the current period',
      tags: ['budgets'],
      responses: {
        '200': { description: 'Array of BudgetView' },
        '401': { description: 'Missing or unknown session user' },
      },
    },
  },
} as const;
