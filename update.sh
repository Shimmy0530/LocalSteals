#!/usr/bin/env bash
set -e

echo "Pulling latest changes..."
git pull

echo "Installing dependencies..."
npm install

echo "Building production bundle..."
npm run build

echo "Restarting app..."
pm2 restart localsteals

echo "Done! Site is live."
