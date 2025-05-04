import { consola } from 'consola';
import { createHooks } from 'hookable';
import { Server } from 'http';
import { Lithia, LithiaOptions } from 'lithia/types';
import { ready } from '../utils';
import { createLithiaServer } from './server';

jest.mock('../utils', () => ({
  error: jest.fn(),
  ready: jest.fn(),
}));

describe('Test Lithia server creation', () => {
  let lithia: Lithia;
  let logger: ReturnType<(typeof consola)['withTag']>;
  let hookSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = consola.withTag('lithia:test');
    lithia = {
      options: {
        server: {
          port: 3000,
          host: 'localhost',
          hooks: createHooks(),
        },
      } as LithiaOptions,
      hooks: createHooks(),
      logger,
    };
    hookSpy = jest.spyOn(lithia.options.server.hooks, 'callHook');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a server instance', async () => {
    const server = await createLithiaServer(lithia);
    expect(server).toBeInstanceOf(Server);
    server.close();
  });

  it('should call server hooks before and after starting', async () => {
    const server = await createLithiaServer(lithia);
    expect(hookSpy).toHaveBeenCalledTimes(2);
    expect(hookSpy).toHaveBeenNthCalledWith(1, 'beforeStart', server, lithia);
    expect(hookSpy).toHaveBeenNthCalledWith(2, 'afterStart', server, lithia);
    server.close();
  });

  it('should log the server information', async () => {
    const server = await createLithiaServer(lithia);
    expect(ready).toHaveBeenCalledWith('Server is running at http://localhost:3000');
    server.close();
  });

  it('should listen on the specified port and host', async () => {
    const server = await createLithiaServer(lithia);
    expect(server.listening).toBe(true);
    expect(server.address()).toEqual({
      port: 3000,
      family: 'IPv6',
      address: '::1',
    });
    server.close();
  });

  describe('Test server request', () => {
    it('should handle incoming requests', async () => {
      const server = await createLithiaServer(lithia);
      const requestListener = jest.fn();
      server.on('request', requestListener);

      const req = new (require('http').IncomingMessage)(new (require('net').Socket)());
      req.method = 'GET';
      req.url = '/test';

      server.emit('request', req, {});

      expect(requestListener).toHaveBeenCalledWith(req, {});
      server.close();
    });
  });
});
