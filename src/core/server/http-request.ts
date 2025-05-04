import type { IncomingHttpHeaders, IncomingMessage } from 'http';
import type { Lithia, LithiaRequest, Possible } from 'lithia/types';
import { parse } from 'url';

export class LithiaHttpRequest implements LithiaRequest {
  private readonly storage: Map<string, any>;

  id: string;
  pathname: string;
  method: string;
  headers: Readonly<IncomingHttpHeaders>;
  query: Readonly<Record<string, string>>;
  params: Readonly<Record<string, string>>;
  ip: string;

  constructor(
    private readonly req: IncomingMessage,
    private readonly lithia: Lithia,
  ) {
    const url = parse(req.url!, true);

    this.storage = new Map<string, any>();
    this.id = this.generateId();
    this.pathname = url.pathname!;
    this.method = req.method!;
    this.headers = req.headers;
    this.params = {};
    this.ip = req.socket.remoteAddress!;
    this.query = this.parseURLSearchParams(new URLSearchParams(url.search!));

    this.storage.set('_lithia', this.lithia);
  }

  async body<T = any>(): Promise<Readonly<T>> {
    if (!['POST', 'PUT', 'PATCH'].includes(this.method)) {
      return Promise.resolve(undefined as T);
    }

    if (this.get('_body')) return this.get('_body') as Readonly<T>;

    const body = await new Promise<T>((resolve, reject) => {
      let body = '';

      this.req.on('data', (chunk) => {
        body += chunk;
      });

      this.req.on('end', () => {
        if (!body.length) {
          resolve(undefined as T);
          return;
        }

        switch (this.headers['content-type']) {
          case 'application/json':
            try {
              resolve(JSON.parse(body));
            } catch (err) {
              reject(err);
            }
            break;
          default:
            resolve(body as T);
        }

        this.req.on('error', (err) => {
          reject(err);
        });
      });
    });

    this.set('_body', body);

    return body as T;
  }

  get<T = any>(key: string): Possible<T> {
    return this.storage.get(key) ?? undefined;
  }

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  on(event: string, callback: (data: any) => void): void {
    this.req.on(event, callback);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  private parseURLSearchParams(url: URLSearchParams): Record<string, string> {
    const params: Record<string, string> = {};

    for (const [key, value] of url.entries()) {
      params[key] = value;
    }

    return params;
  }
}
