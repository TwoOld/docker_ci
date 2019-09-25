echo Deploy Project

git pull

cd frontend
npm install -g @tarojs/cli
npm run build:h5
cd ..

docker-compose down
docker-compose up -d --force-recreate --build

echo Deploy end
