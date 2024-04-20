import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const echo = createRoute({
  path: '/echo',
  method: 'post',
  description: '受け取った入力値をそのまま応答する',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            input: z.string().openapi({
              example: 'Hello World!',
              description: '入力',
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            result: z.string().openapi({
              example: 'Hello World!',
              description: '応答',
            }),
          }),
        },
      },
    },
  },
  
});

app.openapi(echo, async c => {
  const body = await c.req.json();
  return c.json({ result: body.input });
}).doc('/specification', {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '1.0.0',
  },
})
.get('/doc', swaggerUI({
  url: '/specification',
}))


export default app
