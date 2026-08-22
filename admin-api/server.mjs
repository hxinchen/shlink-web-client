import http from 'node:http';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const port = Number(process.env.PORT ?? 8090);
const container = process.env.SHLINK_CONTAINER ?? 'quarks-shlink';
const shlinkBaseUrl = (process.env.SHLINK_BASE_URL ?? 'http://shlink:8080/rest/v3').replace(/\/$/, '');
const openapi = JSON.parse(await readFile(new URL('./openapi.json', import.meta.url), 'utf8'));
const docsHtml = await readFile(new URL('./docs.html', import.meta.url), 'utf8');

const json = (res, status, body) => {
  res.writeHead(status, {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'});
  res.end(JSON.stringify(body));
};
const body = async (req) => {
  let data = ''; for await (const chunk of req) data += chunk;
  return data ? JSON.parse(data) : {};
};
const run = async (args) => {
  const result = await exec('docker', ['exec', container, 'shlink', ...args], {maxBuffer: 1024 * 1024});
  return result.stdout.trim();
};
const parseKeys = (output) => output.split('\n').filter((line) => line.includes('|') && !line.includes('---') && !line.includes('Name ')).map((line) => line.split('|').map((part) => part.trim()).filter(Boolean)).filter((parts) => parts.length >= 4).map(([name, enabled, expirationDate, roles]) => ({name, enabled: enabled.includes('+'), expirationDate: expirationDate === '-' ? null : expirationDate, roles: roles.split(',').map((role) => role.trim()).filter(Boolean)}));
const route = (req) => new URL(req.url, 'http://localhost').pathname.replace(/^\/admin-api/, '');
const requestUrl = (req) => new URL(req.url, 'http://localhost');
const shortCode = '[^/]+';
const proxyRoutes = [
  {method: 'GET', pattern: /^\/short-urls$/},
  {method: 'POST', pattern: /^\/short-urls$/},
  {method: 'GET', pattern: new RegExp(`^/short-urls/${shortCode}$`)},
  {method: 'PATCH', pattern: new RegExp(`^/short-urls/${shortCode}$`)},
  {method: 'DELETE', pattern: new RegExp(`^/short-urls/${shortCode}$`)},
  {method: 'GET', pattern: new RegExp(`^/short-urls/${shortCode}/visits$`)},
  {method: 'GET', pattern: /^\/visits$/},
  {method: 'GET', pattern: /^\/(?:domains|tags)(?:\/[^/]+)?\/visits$/},
];
const isProxyRoute = (method, path) => proxyRoutes.some((route) => route.method === method && route.pattern.test(path));
const requestBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
};
const proxyToShlink = async (req, res, url) => {
  const apiKey = req.headers['x-shlink-api-key'] ?? req.headers['x-api-key'];
  if (typeof apiKey !== 'string' || !apiKey) return json(res, 401, {error: 'Missing X-Shlink-Api-Key header'});
  const upstreamUrl = `${shlinkBaseUrl}${url.pathname.replace(/^\/admin-api/, '')}${url.search}`;
  const headers = {'X-Api-Key': apiKey};
  if (typeof req.headers['content-type'] === 'string') headers['content-type'] = req.headers['content-type'];
  const upstream = await fetch(upstreamUrl, {method: req.method, headers, body: req.method === 'GET' ? undefined : await requestBody(req)});
  const responseBody = Buffer.from(await upstream.arrayBuffer());
  res.writeHead(upstream.status, {'content-type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8', 'cache-control': 'no-store'});
  res.end(responseBody);
};

const server = http.createServer(async (req, res) => {
  try {
    const path = route(req);
    const url = requestUrl(req);
    if (isProxyRoute(req.method ?? 'GET', path)) return proxyToShlink(req, res, url);
    if (req.method === 'GET' && path === '/openapi.json') return json(res, 200, openapi);
    if (req.method === 'GET' && (path === '/docs' || path === '/docs.html')) { res.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'}); return res.end(docsHtml); }
    if (req.method === 'GET' && path === '/api-keys') return json(res, 200, {items: parseKeys(await run(['api-key:list', '--no-interaction']))});
    const match = path.match(/^\/api-keys\/([^/]+)$/);
    if (match && req.method === 'POST' && path === '/api-keys') return json(res, 400, {error: 'invalid route'});
    if (req.method === 'POST' && path === '/api-keys') {
      const input = await body(req); const args = ['api-key:generate', '--name', String(input.name), '--no-interaction'];
      if (input.expirationDate) args.push('--expiration-date', String(input.expirationDate));
      if (input.authorOnly) args.push('--author-only'); if (input.domainOnly) args.push('--domain-only', String(input.domainOnly)); if (input.noOrphanVisits) args.push('--no-orphan-visits');
      const output = await run(args); const found = output.match(/Generated API key:\s*"([^"]+)"/);
      if (!found) throw new Error('Shlink did not return the generated key');
      res.writeHead(201, {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'}); return res.end(JSON.stringify({name: input.name, apiKey: found[1]}));
    }
    if (match && req.method === 'DELETE') { await run(['api-key:delete', decodeURIComponent(match[1]), '--no-interaction']); res.writeHead(204); return res.end(); }
    if (match && req.method === 'PATCH') {
      const input = await body(req); const oldName = decodeURIComponent(match[1]);
      if (input.newName) await run(['api-key:rename', oldName, String(input.newName), '--no-interaction']);
      if (input.enabled === false) await run(['api-key:disable', String(input.newName ?? oldName), '--no-interaction']);
      return json(res, 200, {ok: true});
    }
    return json(res, 404, {error: 'not found'});
  } catch (error) { return json(res, 400, {error: error instanceof Error ? error.message : 'request failed'}); }
});
server.listen(port, '0.0.0.0', () => console.log(`Quarks admin API listening on ${port}`));
