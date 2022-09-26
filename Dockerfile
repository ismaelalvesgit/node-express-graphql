# Build applicasion
FROM node:14-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Release applicasion
FROM node:14.18.0-alpine
LABEL maintainer="Ismael Alves <cearaismael1997@gmail.com>"
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./
RUN npm install --only=production

RUN addgroup -S app && adduser -S -G app app 
USER app

EXPOSE 3000

CMD [ "node", "src/index.js" ]