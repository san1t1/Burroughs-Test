FROM node:18-slim as client-build
WORKDIR /home/user
COPY client/package.json client/package-lock.json /home/user/
COPY client/public public
COPY client/src/ src 
COPY client/tsconfig.json ./
RUN npm ci && \
    npm run build 

FROM node:18-slim as server-build
WORKDIR /home/user
COPY server/package.json server/package-lock.json server/tsconfig.json server/tsconfig.build.json /home/user/
COPY server/src /home/user/
RUN npm ci && \
    npm run build && \
    npm prune --omit=dev

# hadolint ignore=DL3007
FROM gcr.io/distroless/nodejs18-debian11:latest
WORKDIR /home/user
COPY payroll-dates.openapi.yaml ./
COPY --from=server-build /home/user/dist/ server/dist
COPY --from=server-build /home/user/node_modules/ server/node_modules
COPY --from=client-build /home/user/build/ server/public/
ENV NODE_ENV=production
CMD ["server/dist/main.js"]