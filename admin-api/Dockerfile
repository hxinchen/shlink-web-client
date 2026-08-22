FROM node:22-alpine
RUN apk add --no-cache docker-cli
WORKDIR /app
COPY package.json server.mjs openapi.json docs.html ./
ENV PORT=8090
EXPOSE 8090
CMD ["node", "server.mjs"]
