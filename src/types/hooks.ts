import type { Hookable } from 'hookable';
import { Server } from 'http';
import { LithiaRequest, LithiaResponse } from './handler';
import { Lithia } from './lithia';

export type HookResult = void | Promise<void>;

export interface LithiaHooks
  extends Hookable<{
    restart: () => HookResult;
    close: () => HookResult;
  }> {}

export interface RouterHooks
  extends Hookable<{
    beforeRequest: (request: LithiaRequest, res: LithiaResponse) => HookResult;
    afterRequest: (request: LithiaRequest, res: LithiaResponse) => HookResult;
    beforeResponse: (request: LithiaRequest, res: LithiaResponse) => HookResult;
    afterResponse: (request: LithiaRequest, res: LithiaResponse) => HookResult;
    beforeError: (err: Error, request: LithiaRequest, res: LithiaResponse) => HookResult;
    afterError: (err: Error, request: LithiaRequest, res: LithiaResponse) => HookResult;
  }> {}

export interface ServerHooks
  extends Hookable<{
    beforeStart: (server: Server, lithia: Lithia) => HookResult;
    afterStart: (server: Server, lithia: Lithia) => HookResult;
    beforeStop: (server: Server, lithia: Lithia) => HookResult;
    afterStop: (server: Server, lithia: Lithia) => HookResult;
  }> {}
