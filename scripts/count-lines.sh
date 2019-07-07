#!/bin/bash
echo "node_modules"
cd "$(dirname "$0")/../node_modules" && ( find . -name '*.js' -print0 | xargs -0 cat ) | wc -l
echo "Shared"
cd ../shared && ( find . -name '*.js' -print0 | xargs -0 cat ) | wc -l
echo "Scripts"
cd ../scripts && ( find . -name '*.js' -print0 | xargs -0 cat ) | wc -l
echo "Server"
cd ../server && ( find . -name '*.js' -print0 | xargs -0 cat ) | wc -l
echo "Client"
cd ../client && ( find . -name '*.js' -print0 | xargs -0 cat ) | wc -l

