#!/bin/bash -e

# Expect server codename as the argument
if [ -z "$1" ]; then
  echo "Usage: $0 <server-codename>"
  exit 1
fi

SERVER_CODENAME="$1"

# Ensure it is DNS-name compatible
if [[ ! "$SERVER_CODENAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "Error: Server codename must only contain lowercase letters, numbers, and hyphens."
  exit 1
fi

# Generate API key
GATEWAY_API_KEYS=$(openssl rand -hex 32)

# Generate JSON-RPC secret
JSON_RPC_SECRET=$(openssl rand -hex 32)

# Save secrets with fnox
export FNOX_PROFILE="$SERVER_CODENAME"
fnox set JSON_RPC_SECRET $JSON_RPC_SECRET
fnox set GATEWAY_API_KEYS $GATEWAY_API_KEYS

# Output the generated API key
echo "Generated secrets for server '$SERVER_CODENAME':"
echo "  GATEWAY_API_KEYS: $GATEWAY_API_KEYS"