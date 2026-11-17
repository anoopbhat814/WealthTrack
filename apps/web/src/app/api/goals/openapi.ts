/** OpenAPI path fragment consumed by scripts/gen-openapi.js. */
export const goalsPath = {
  '/api/goals': {
    get: {
      summary: 'List savings goals with projected completion dates',
      tags: ['goals'],
      responses: {
        '200': { description: 'Array of GoalView ordered by target date' },
        '401': { description: 'Missing or unknown session user' },
      },
    },
  },
} as const;
