## Docker 安装

```shell
# apt升级
apt-get update

# 添加相关软件包
apt-get install apt-transport-https ca-certificates curl software-properties-common

# 下载软件包的合法性，需要添加软件源的 GPG 密钥
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | apt-key add -

# source.list 中添加 Docker 软件源
add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"

# 安装 Docker CE
apt-get update
apt-get install docker-ce

# 启动 Docker CE
systemctl enable docker
systemctl start docker

# 建立 docker 用户组（附加-可选）
groupadd docker
usermod -aG docker $USER

# Helloworld 测试
docker run hello-world
```

镜像加速

- [Azure 中国镜像]()
- [七牛云加速器]()

```shell
# /etc/docker/daemon.json
{
    "registry-mirrors": [
        "https://dockerhub.azk8s.cn",
        "https://reg-mirror.qiniu.com"
    ]
}

systemctl daemon-reload
systemctl restart docker
```

## 简单 Nginx 服务

```shell
# 拉取官方镜像 - 面向docker的只读模板
docker pull nginx

# 查看
docker images nginx

# 启动镜像
mkdir www
echo 'hello docker!!!' >> www/index.html

# 启动
# www目录里面放一个index.html
docker run -p 8000:80 -v $PWD/www:/usr/share/nginx/html nginx

# 后台启动
docker run -p 8000:80 -v $PWD/www:/usr/share/nginx/html -d nginx

# 查看当前运行中nginx进程
docker ps

# 查看所有nginx进程
docker ps -a

# 停止
docker stop ID前三位

# 启动
docker start ID前三位

# 删除
docker rm ID前三位

# 进入docker nginx内部
docker exec -it ID前三位 /bin/bash
```

## Docker 运行过程

- 镜像(Image)

  面向 Docker 的只读模板

- 容器(Container)

  镜像的运行实例

- 仓库(Registry)

  存储镜像的服务器

## Dockerfile 定制镜像

> 镜像的定制实际上就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，那么之前提及的无法重复的问题、镜像构建透明性的问题、体积的问题都会解决。这个脚本就是 Dockerfile。

- 定制自己的 web 服务器

创建 source/nginx 目录

```shell
# 创建 Dockerfile 文件
FROM nginx:latest
RUN echo '<h1>Hello Docker !!!</h1>' > /usr/share/nginx/html/index.html

# 进入nginx目录下
docker built -t nginx:chiu .

# 启动
docker run -p 8000:80 nginx:chiu
```

## 定制 NodeJS 镜像

定制一个程序 NodeJS 镜像

创建 source/node 目录

```shell
# 安装 npm
apt-get install npm

# npm 初始化
npm init -y

# 安装 koa
npm i koa -S

# app.js
const Koa = require('koa')
const app = new Koa()
app.use(ctx => {
	ctx.body = 'Hello NodeJS !!!'
})
app.listen(3000, () => {
	console.log('app started at 3000')
})

# Dockerfile
FROM node:10-alpine
ADD . /app/
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]

# 定制
docker build -t chiunode .

# 启动
docker run -p 3000:3000 chiunode
```

## 定制 PM2 镜像

创建 source/pm2 目录

```shell
# npm 初始化
npm init -y

# 安装 koa
npm i koa -S

# app.js
const Koa = require('koa')
const app = new Koa()
app.use(ctx => {
	ctx.body = 'Hello PM2 !!!'
})
app.listen(3000, () => {
	console.log('app started at 3000')
})

# process.yml
apps:
	- script: app.js
	  instancess: 2
	  watch: true
	  env:
		NODE_ENV: production

# Dockerfile
FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org/ && \
    npm i
EXPOSE 3000
# pm2在docker中使用命令为pm2-docker
CMD ["pm2-runtime", "start", "process.yml"]


# 定制
docker build -t chiupm2 .

# 启动
docker run -p 3000:3000 -d chiunode
```

## Compose 安装

```shell
# 安装
apt-get install docker-compose

mkdir helloworld
cd helloworld

# docker-compose.yml
# 根据版本填写
version: '2'
services:
  hello-world:
    image: hello-world

# 启动
docker-compose up
```

## Compose

Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排

```shell
# docker-compose.yml
version: '2'
services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8000:8081
```
