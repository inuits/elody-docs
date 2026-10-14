# Elody Filesystem Importer Service

Imports files and their metadata from a folder on a mounted filesystem. The frontend lists the folders and starts an import through [importModule](/services/elody-frontend/graphql-modules#importmodule), which calls `/importer/directories` and `/importer/start`.

::: info Documentation in progress
This page is a placeholder. Full documentation for this service will follow.
:::

## At a glance

| | |
| --- | --- |
| Repository | [inuits/elody-filesystem-importer-service](https://github.com/inuits/elody-filesystem-importer-service) |
| Compose include | `docker-compose-include-filesystem-importer-service.yml` |
