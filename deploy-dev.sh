echo Deploy Project

cd frontend/
ls
cd ..
ls

git pull

docker-compose down
docker-compose up -d --force-recreate --build