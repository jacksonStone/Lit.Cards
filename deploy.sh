#!/bin/bash
rm -rf libby_cards || { echo "Failed to cleanup local files"; exit 1; }
rm -rf libby_cards.zip || { echo "Failed to cleanup local zip files"; exit 1; }
npm install || { echo "Failed to install node modules"; exit 1; }
NODE_ENV=production npm run build || { echo "Failed to build"; exit 1; }
rm -rf node_modules || { echo "Failed to remove node modules"; exit 1; }
npm install --production || { echo "Failed to install production modules"; exit 1; }
NODE_ENV=production npm run massage-assets || { echo "Failed to massage assets"; exit 1; }
mkdir libby_cards || { echo "Failed to make libby_cards directory"; exit 1; }
cp -r node_modules libby_cards || { echo "Failed to copy node_modules"; exit 1; }
cp -r assets libby_cards || { echo "Failed to copy assets"; exit 1; }
cp -r server libby_cards
cp -r shared libby_cards || { echo "Failed to copy shared"; exit 1; }
zip -r -X libby_cards.zip libby_cards || { echo "Failed to zip"; exit 1; }

scp -i $EC2_PEM_PATH libby_cards.zip ubuntu@$EC2_PUBLIC_IP:/home/ubuntu/.temp/ || { echo "Failed to copy to EC2"; exit 1; }
ssh -i $EC2_PEM_PATH ubuntu@$EC2_PUBLIC_IP << EOF
  mv ./.temp/libby_cards.zip . || { echo "Failed to move the file"; exit 1; }
  rm -rf libby_cards || { echo "Failed to Remove"; exit 1; }
  unzip -q libby_cards.zip -d libby_cards || { echo "Failed to unzip"; exit 1; }
  rm libby_cards.zip || { echo "Failed to remove the zip"; exit 1; }
  sudo systemctl restart libby_cards || { echo "Failed to restart the service"; exit 1; }
EOF
rm libby_cards.zip || { echo "Failed to remove the zip"; exit 1; }
rm -rf libby_cards || { echo "Failed to remove the folder"; exit 1; }
echo "Deployed!"

