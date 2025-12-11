#!/bin/bash
set -e

# Usage: ./scripts/remote_deploy.sh <host> <user> <key_path>

HOST=$1
USER=$2
KEY=$3

if [ -z "$HOST" ] || [ -z "$USER" ] || [ -z "$KEY" ]; then
  echo "Usage: ./scripts/remote_deploy.sh <host> <user> <key_path>"
  exit 1
fi

echo "🚀 Deploying to $USER@$HOST..."

ssh -i $KEY $USER@$HOST "cd /var/www/myinsurancebuddy && git pull && ./scripts/build_and_deploy.sh"

echo "✅ Remote deployment triggered!"
