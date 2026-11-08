import { createApiApp } from '../server';

const app = createApiApp();
export default function handler(req: any, res: any) {
  // Vercel sends the original API path through the rewrite parameter.
  const url = new URL(req.url, 'http://internal');
  const route = url.searchParams.get('route');
  if (route !== null) {
    url.searchParams.delete('route');
    req.url = `/api/${route}${url.search}`;
  }
  return app(req, res);
}
