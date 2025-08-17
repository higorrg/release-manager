# Multi-stage build for Angular production
FROM docker.io/library/node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build

# Production stage
FROM docker.io/library/nginx:1.25-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/release-manager-frontend /usr/share/nginx/html

# Create a script to substitute environment variables in nginx config
RUN apk add --no-cache gettext

# Create startup script to handle environment variable substitution
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Substitute environment variables in nginx config' >> /docker-entrypoint.sh && \
    echo 'envsubst '"'"'$API_BASE_URL'"'"' < /etc/nginx/nginx.conf > /tmp/nginx.conf' >> /docker-entrypoint.sh && \
    echo 'mv /tmp/nginx.conf /etc/nginx/nginx.conf' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
