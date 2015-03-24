FROM ubuntu:14.04
MAINTAINER Grant Pidwell <grantpidwell@infinity-g.com>

#### General; install NodeJS, npm and Bower ####

RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update && apt-get install -y curl wget git nodejs
RUN npm install bower -g
RUN npm install gulp -g

#### SSH keys for Github access ####
# Ensure that the /.ssh folder is present in the root context!

RUN mkdir -p /root/.ssh
ADD /.ssh/id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

#### Clone Github repo ####

RUN mkdir -p home
RUN git clone -b dgmt-demo git@github.com:InfinityG/supercrow.git /home/supercrow

# Install npm dependencies; bower dependencies
# NOTE: Make sure that an outgoing port is open on the firewall to allow
# Bower to retrieve dependencies via the git:// protocol (9418)
RUN \
  cd /home/supercrow && \
  npm install && \
  bower install --allow-root

WORKDIR /home/supercrow

EXPOSE 8000

CMD gulp

# To build: sudo docker build -t infinityg/supercrow:v1 .
# To run: sudo docker run -it --rm infinityg/supercrow:v1
#   - with port: -p 8000:8000
# Inspect: sudo docker inspect [container_id]
# Delete all containers: sudo docker rm $(docker ps -a -q)
# Delete all images: sudo docker rmi $(docker images -q)
# Connect to running container: sudo docker exec -it [container_id] bash