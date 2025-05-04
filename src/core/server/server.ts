import { createServer, type Server } from 'http';
import type { Lithia } from 'lithia/types';
import { error, ready } from '../utils';
import { handleRequest } from './request-handler';

export async function createLithiaServer(lithia: Lithia): Promise<Server> {
  const server = createServer(async (req, res) => {
    await handleRequest(req, res, lithia);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      error(`Port ${lithia.options.server.port} is already in use. Please use a different port.`);
      process.exit(1);
    }
  });

  await lithia.options.server.hooks.callHook('beforeStart', server, lithia);
  await new Promise<void>((resolve) => {
    server.listen(lithia.options.server.port, lithia.options.server.host, () => {
      ready(`Server is running at http://${lithia.options.server.host}:${lithia.options.server.port}`);
      resolve();
    });
  });
  await lithia.options.server.hooks.callHook('afterStart', server, lithia);

  return server;
}
