#!/bin/bash
cp -r assets/fonts electron/assets
cp -r assets/static-images electron/assets
npm run build-electron
cd electron && npm run start