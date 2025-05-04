import { Server } from 'http';
import { createLithia, createLithiaServer } from 'lithia/core';
import { Lithia } from 'lithia/types';

jest.mock('c12', () => {
  return {
    loadConfig: jest.fn().mockResolvedValue({
      config: {
        server: {
          port: 5555,
          host: 'localhost',
        },
        router: {
          baseDir: `${__dirname}/routes`,
        },
      },
    }),
  };
});

let srv: Server;
let lithia: Lithia;

beforeAll(async () => {
  lithia = await createLithia();
  srv = createLithiaServer(lithia);
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    if (!srv) {
      resolve();
      return;
    }

    srv.close(() => {
      resolve();
    });
  });
});
