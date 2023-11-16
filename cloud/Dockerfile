FROM docker.io/library/node:20-alpine as builder

ARG siteUrl=/
ARG noIndex=0
ARG cmsApiToken

WORKDIR /app

ENV MY_ENVIRONMENT production
ENV siteUrl $siteUrl
ENV noIndex $noIndex
ENV cmsApiToken $cmsApiToken

RUN apk add --no-cache git

COPY package.json *.lock .yarn* ./

RUN if [ -f *.lock ]; then \
      yarn install --immutable; \
    else \
      yarn install; \
    fi;

COPY . .

ENV NODE_ENV production

RUN yarn build

# ---

FROM ghcr.io/alwatr/nginx-ws:1.1.1 as nginx

# Copy builded files from last stage
COPY --from=builder /app/dist/ ./

# RUN pwd; ls -lAhF;
