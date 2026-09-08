<p align="center">
  <a href="https://elody.eu"><img src="https://elody.eu/images/logo.svg" alt="Elody" width="96" /></a>
</p>

<p align="center">Part of <a href="https://elody.eu">Elody</a> — the open semantic data platform.<br /><a href="https://docs.elody.eu">Documentation</a> · <a href="https://elody.eu">Website</a></p>

# Elody Docs

General documentation site for the Elody semantic data platform, built with [VitePress](https://vitepress.dev).

## Docker

The `Dockerfile` uses BuildKit build secrets for the private npm registry, so
export your Nexus token first (BuildKit is the default in Docker 23+).

```bash
export NPM_CONFIG_REGISTRY=https://nexus.inuits.io/repository/npm/
export NPM_CONFIG__AUTH_TOKEN=<your-nexus-token>

docker build \
  --secret id=NPM_CONFIG_REGISTRY,env=NPM_CONFIG_REGISTRY \
  --secret id=NPM_CONFIG__AUTH_TOKEN,env=NPM_CONFIG__AUTH_TOKEN \
  -t elody-docs .

docker run --rm -p 8080:80 elody-docs
```

The site is then served on [http://localhost:8080](http://localhost:8080).

To run the dev server in a container instead, with the source volume-mounted:

```bash
docker build --target development-stage -t elody-docs-dev .
docker run --rm -p 5173:5173 -v "$PWD:/app" \
  -e NPM_CONFIG__AUTH_TOKEN=$NPM_CONFIG__AUTH_TOKEN \
  elody-docs-dev
```
