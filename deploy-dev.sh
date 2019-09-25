echo Deploy Project

git pull

cd frontend
npm i
cd ..

docker-compose down
docker-compose up -d --force-recreate --build

echo Deploy end
