# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

# Install a Chromium browser for Karma (ChromeHeadless)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    chromium-sandbox \
    fonts-liberation \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

USER node
