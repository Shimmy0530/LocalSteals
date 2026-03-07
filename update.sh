#!/usr/bin/env bash
# Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
# Proprietary and confidential. Unauthorized copying prohibited.

set -e

read -p "Branch to pull [$(git branch --show-current)]: " BRANCH
BRANCH="${BRANCH:-$(git branch --show-current)}"

echo "Pulling latest changes from $BRANCH..."
git pull origin "$BRANCH"

echo "Installing dependencies..."
npm install

echo "Building production bundle..."
npm run build

echo "Restarting app..."
pm2 restart localsteals

echo "Done! Site is live."