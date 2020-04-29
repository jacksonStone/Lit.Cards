#!/bin/bash
cp -r assets/fonts electron/assets
cp -r assets/static-images electron/assets
cp -r assets/webfonts electron/assets
./scripts/update-server-files-for-electron.sh
npm run build-electron
cd electron && npm run start
