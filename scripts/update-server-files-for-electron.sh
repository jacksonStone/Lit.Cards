#!/bin/bash
rm -rf electron/server
cp -r server electron/server
cp -r shared electron/shared
rm -rf electron/server/routes
rm -rf electron/server/_test
rm electron/server/validate-envs.js
rm electron/server/index.js
