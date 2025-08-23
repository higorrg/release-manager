#!/bin/bash

# View logs for Release Manager services
set -e

ENVIRONMENT="dev"
FOLLOW=""
TAIL="50"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod)
            ENVIRONMENT="prod"
            shift
            ;;
        --dev)
            ENVIRONMENT="dev"
            shift
            ;;
        -f|--follow)
            FOLLOW="-f"
            shift
            ;;
        -t|--tail)
            TAIL="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS] [SERVICE]"
            echo ""
            echo "Options:"
            echo "  --dev           Use development environment (default)"
            echo "  --prod          Use production environment"
            echo "  -f, --follow    Follow log output"
            echo "  -t, --tail N    Show last N lines (default: 50)"
            echo "  -h, --help      Show this help"
            echo ""
            echo "Services:"
            echo "  postgres        Database logs"
            echo "  keycloak        Authentication server logs"
            echo "  backend         Backend application logs"
            echo "  frontend        Frontend/nginx logs"
            echo "  azurite         Storage emulator logs (dev only)"
            echo ""
            echo "Examples:"
            echo "  $0                          # Show all dev logs"
            echo "  $0 backend                  # Show backend logs"
            echo "  $0 --prod -f                # Follow all prod logs"
            echo "  $0 --prod backend -f        # Follow prod backend logs"
            exit 0
            ;;
        *)
            SERVICE="$1"
            shift
            ;;
    esac
done

# Determine compose file
if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="compose.prod.yml"
    ENV_FILE=".env.prod"
    echo "📋 Viewing production logs..."
else
    COMPOSE_FILE="compose.dev.yml"
    ENV_FILE=""
    echo "📋 Viewing development logs..."
fi

# Build command
CMD="podman-compose -f $COMPOSE_FILE"
if [ -n "$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
    CMD="$CMD --env-file $ENV_FILE"
fi

CMD="$CMD logs --tail=$TAIL $FOLLOW"

if [ -n "$SERVICE" ]; then
    CMD="$CMD $SERVICE"
    echo "🔍 Service: $SERVICE"
fi

echo "📊 Tail: $TAIL lines"
if [ -n "$FOLLOW" ]; then
    echo "👀 Following logs... (Press Ctrl+C to stop)"
fi

echo ""

# Execute command
$CMD