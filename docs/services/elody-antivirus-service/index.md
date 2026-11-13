# Elody Antivirus Service

Scans uploaded mediafiles with [ClamAV](https://www.clamav.net/) and publishes the result on RabbitMQ (`file_scanned`). It has no HTTP API apart from `/health`: everything runs over AMQP.

::: info Documentation in progress
This page is a placeholder. Full documentation for this service will follow.
:::

## At a glance

| | |
| --- | --- |
| Repository | [inuits/elody-antivirus-service](https://github.com/inuits/elody-antivirus-service) |
| Compose include | `docker-compose-include-antivirus-service.yml` |
