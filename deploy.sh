#!/bin/bash
rm -rf libby_cards
rm -rf libby_cards.zip
npm install
NODE_ENV=production npm run build
rm -rf node_modules
npm install --production
NODE_ENV=production npm run massage-assets
mkdir libby_cards
cp -r node_modules libby_cards
cp -r assets libby_cards
cp -r server libby_cards
cp -r shared libby_cards
zip -r -X libby_cards.zip libby_cards

scp -i /Users/jacksonstone/Desktop/Jackson\ Personal\ Site\ Key.pem libby_cards.zip ubuntu@3.19.146.227:/home/ubuntu/.temp/
ssh -i /Users/jacksonstone/Desktop/Jackson\ Personal\ Site\ Key.pem ubuntu@3.19.146.227 << EOF
  mv ./.temp/libby_cards.zip . || { echo "Failed to move the file"; exit 1; }
  rm -rf libby_cards
  unzip libby_cards.zip -d libby_cards
  rm libby_cards.zip
  sudo systemctl restart libby_cards
EOF
rm libby_cards.zip
rm -rf libby_cards

