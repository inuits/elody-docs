### Base stage
FROM python:3.11-alpine AS base-stage

RUN adduser --disabled-password --home /app --shell /bin/bash app
WORKDIR /app

COPY docker/entrypoint*.sh /
COPY requirements.txt ./

### Development stage
FROM base-stage AS development-stage

USER app

ENV APP_ENV=dev

COPY docker/pip.conf /etc

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8000

### Build stage
FROM base-stage AS build-stage

COPY docker/pip.conf /etc
COPY mkdocs ./mkdocs

RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app/mkdocs
RUN mkdocs build

### Production stage
FROM docker.io/nginx:1.25.3-alpine as production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/mkdocs/site /usr/share/nginx/html

EXPOSE 80
