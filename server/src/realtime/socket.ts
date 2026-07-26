import fp from 'fastify-plugin';
import { Server, type ServerOptions } from 'socket.io';
import type { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

export default fp(async function (fastify: FastifyInstance, opts: Partial<ServerOptions>) {
  const io = new Server(fastify.server, {
    cors: { origin: '*' },
    ...opts
  });

  // Expose 'io' globally on the fastify instance
  fastify.decorate('io', io);

  fastify.addHook('preClose', (done) => {
    io.local.disconnectSockets(true);
    done();
  });
});
