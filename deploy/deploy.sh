#!/usr/bin/env bash
# Build and sync the static site to a server folder (run from the repo root).
# Usage: ./deploy/deploy.sh user@server:/var/www/najdalanazi
set -euo pipefail
TARGET="${1:?usage: deploy.sh user@host:/var/www/najdalanazi}"
npm ci --ignore-scripts
npm run build
rsync -avz --delete \
  --exclude='UP_PRE-QUALIFICATION.pdf' \
  --include='index.html' --include='robots.txt' --include='sitemap.xml' --include='site.webmanifest' \
  --include='favicon.png' --include='apple-touch-icon.png' \
  --include='assets/' --include='assets/css/***' --include='assets/js/***' --include='assets/img/***' --include='assets/pdf/***' \
  --exclude='*' \
  ./ "$TARGET"
echo "Deployed to $TARGET"
