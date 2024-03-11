FROM ghcr.io/alwatr/node:20.10.0 as builder

RUN apk add --no-cache git;
RUN set -ex; corepack enable;

ARG siteUrl=${siteUrl}
ARG cmsApiToken
ENV siteUrl $siteUrl
ENV cmsApiToken $cmsApiToken
COPY . .

RUN set -eux; \
  yarn install --immutable; \
  yarn build; \
  ls -lahF .;

# ---

FROM ghcr.io/alwatr/nginx-ws:2.4.2
LABEL org.opencontainers.image.base.name="ghcr.io/alwatr/nginx-ws:2.4.2"

COPY --from=builder /app/dist/ .
# RUN set -eux; ls -RlahF /data;
