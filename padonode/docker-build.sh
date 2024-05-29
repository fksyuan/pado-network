#！/bin/bash
if ! type node > /dev/null 2>&1; then
  echo "Please install nodejs with version > 18"
  exit 1
fi
npm install --save @padolabs/pado-ao-sdk
npm install
npm run build
docker build -t padolabs/pado-network:latest .
