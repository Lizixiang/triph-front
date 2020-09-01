image_version=`date +%Y%m%d%H%M`;
echo $image_version;
# cd vue2docker
git pull --rebase origin master;
sudo docker stop vue2docker;
sudo docker rm vue2docker;
sudo docker build -t vue2docker:$image_version .;
sudo docker images;
sudo docker run -p 10002:80 -d --name vue2docker vue2docker:$image_version;
# -v ~/docker-data/house-web/appsettings.json:/app/appsettings.json -v ~/docker-data/house-web/NLogFile/:/app/NLogFile   --restart=always
sudo docker logs vue2docker;
#删除build过程中产生的镜像    #docker image prune -a -f
sudo docker rmi $(docker images -f "dangling=true" -q)
