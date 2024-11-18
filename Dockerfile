# Stage 1 - the build process
FROM node:18-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
ARG VITE_APP_ENV
RUN if [ "$VITE_APP_ENV" = "docker" ]; then \
      npm run build:docker; \
    elif [ "$VITE_APP_ENV" = "prod" ]; then \
      npm run build:prod; \
    else \
      npm run build:dev; \
    fi
# Stage 2 - the production environment
FROM nginx:1.17.8-alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]