# Quarks Click Admin API

This service exposes the Quarks Click API at `/admin-api`. It is intended to run behind the existing Basic Auth protected `admin.quarks.click` host.

Endpoints:

- `GET /admin-api/api-keys`
- `POST /admin-api/api-keys` (the complete key is returned once)
- `PATCH /admin-api/api-keys/{name}` (rename or disable)
- `DELETE /admin-api/api-keys/{name}`
- `GET|POST /admin-api/short-urls` (business requests require `X-Shlink-Api-Key`)
- `GET|PATCH|DELETE /admin-api/short-urls/{shortCode}`
- `GET /admin-api/short-urls/{shortCode}/visits`
- `GET /admin-api/visits`
- `GET /admin-api/domains/{domain}/visits`
- `GET /admin-api/tags/{tag}/visits`
- `GET /admin-api/docs`
- `GET /admin-api/docs.html`
- `GET /admin-api/openapi.json`

Short URL and analytics routes forward the caller's `X-Shlink-Api-Key` to Shlink as `X-Api-Key`; they do not require Basic Auth. API key administration still uses the admin host's Basic Auth because Shlink exposes those commands through its CLI rather than a REST endpoint. The container requires access to the Docker socket and uses a fixed command allowlist with no shell input.
