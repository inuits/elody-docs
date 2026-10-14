# Elody Storage

A Flask service in front of the S3-compatible object store (MinIO locally, any S3 provider in production). It hands out signed URLs and tickets for uploads and downloads, handles resumable chunked uploads, stores transcode outputs, and finds duplicates by MD5.

::: info Documentation in progress
This page is a placeholder. Full documentation for this service will follow.
:::

## At a glance

| | |
| --- | --- |
| Repository | [inuits/elody-storage](https://github.com/inuits/elody-storage) |
| Compose include | `docker-compose-include-storage-api.yml` |
