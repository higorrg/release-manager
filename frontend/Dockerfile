# Multi-stage build for Angular frontend

# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments
ARG BACKEND_URL=http://localhost:8081
ARG KEYCLOAK_URL=http://localhost:8080

# Create production environment file
RUN echo "export const environment = { \
  production: true, \
  apiUrl: '${BACKEND_URL}/api', \
  keycloak: { \
    url: '${KEYCLOAK_URL}', \
    realm: 'release-manager', \
    clientId: 'release-manager-frontend' \
  } \
};" > src/environments/environment.prod.ts

# Build application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/dist/release-manager-frontend /usr/share/nginx/html

# Copy health check script
COPY health-check.sh /usr/local/bin/health-check.sh
RUN chmod +x /usr/local/bin/health-check.sh

# Create health endpoint
RUN echo '{"status":"ok","service":"release-manager-frontend"}' > /usr/share/nginx/html/health

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]