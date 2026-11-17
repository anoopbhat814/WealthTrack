/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const taxPath = {
  '/api/tax': {
    get: {
      summary: 'Realised gains, dividends and lot detail for a tax year',
      tags: ['tax'],
      parameters: [{ name: 'year', in: 'query', required: true, schema: { type: 'integer', minimum: 2000 } }],
      responses: { '200': { description: 'TaxReport' }, '400': { description: 'Invalid year' } },
    },
  },
} as const;
