# Elody Transcode Service

A Flask service that converts mediafiles between formats (JPEG, MP3, MP4, PDF) and bundles mediafiles into downloadable zips. Other services call it over HTTP or trigger it through RabbitMQ events; it reads source files from the storage API and writes the results back.

::: info Documentation in progress
This page is a placeholder. Full documentation for this service will follow.
:::

## At a glance

| | |
| --- | --- |
| Repository | [inuits/elody-transcode-service](https://github.com/inuits/elody-transcode-service) |
| Compose include | `docker-compose-include-transcode-service.yml` |
