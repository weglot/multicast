import { join } from 'path';
import * as requestIp from 'request-ip';

import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';
import { Subscription } from './resolvers/Subscription';

import proxy from './routers/proxy.router';
import client from './routers/client.router';

import {
  PORT,
  DISABLE_PLAYGROUND,
  PLAYGROUND_URL,
  SANDBOX,
} from './services/config.service';
import { initializeDatabase } from './services/initialize-database.service';
import { startScanning } from './services/scan-devices.service';

import { authMiddleware } from './middleware/auth.middleware';
import { fallbackMiddleware } from './middleware/fallback.middleware';

const typeDefs = importSchema(join(__dirname, 'schema.graphql'));

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

export async function startServer(fallback = false) {
  const db = fallback ? null : await initializeDatabase();
  if (db) startScanning();
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: SANDBOX
      ? []
      : fallback
      ? [authMiddleware, fallbackMiddleware]
      : [authMiddleware],
    context: ({ request, connection }) => {
      const authorization = request
        ? request.headers.authorization
        : connection
        ? (connection as any).context.Authorization
        : '';
      const [, token = null] = /^Bearer (.+)$/.exec(authorization) || [];

      return {
        db,
        user: { token },
      };
    },
  });

  // attach client IP info to request object in handlers
  server.express.use(requestIp.mw());

  // setup __proxy route for stripping problematic iframe headers
  server.express.use('/__proxy', proxy);

  // serve client application with server info injected
  server.express.use('/web', client);

  // listen on the provided PORT
  server.start(
    { port: PORT, playground: DISABLE_PLAYGROUND ? false : PLAYGROUND_URL },
    () => {
      const playgroundMessage = DISABLE_PLAYGROUND
        ? 'disabled'
        : `http://localhost:${PORT}${PLAYGROUND_URL}`;
      console.log();
      console.log('              ┌────────────────────┐');
      console.log(`              │ MultiCast is live! │`);
      console.log('              └────────────────────┘');
      console.log();
      console.log(`              Web UI: http://localhost:${PORT}/web`);
      console.log(`  GraphQL Playground: ${playgroundMessage}`);
      console.log();
    },
  );
}
