/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const networthPath = {
  '/api/networth': {
    get: {
      summary: 'Net worth history and current asset allocation',
      tags: ['networth'],
      parameters: [{ name: 'days', in: 'query', required: false, schema: { type: 'integer', default: 365 } }],
      responses: { '200': { description: '{ series: NetWorthPoint[], allocation: AllocationSlice[] }' } },
    },
  },
} as const;
