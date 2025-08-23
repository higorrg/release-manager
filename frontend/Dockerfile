# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments
ARG API_URL=http://backend:8080
ARG KEYCLOAK_URL=http://keycloak:8080

# Replace environment variables in config files
RUN sed -i "s|http://localhost:8080|$API_URL|g" src/environments/environment.prod.ts
RUN sed -i "s|http://keycloak:8080|$KEYCLOAK_URL|g" src/environments/environment.prod.ts

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY --from=builder /app/dist/release-manager-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY infrastructure/nginx/nginx.conf /etc/nginx/nginx.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]