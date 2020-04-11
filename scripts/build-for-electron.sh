#!/bin/bash
cp -r assets/fonts electron/assets
cp -r assets/static-images electron/assets
cp -r assets/webfonts electron/assets
npm run build-electron
cd electron && npm run start
