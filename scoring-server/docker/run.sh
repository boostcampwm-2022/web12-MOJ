#!/bin/bash

if [ -z "$NAME" ]
then
  exit
fi

docker kill $NAME
docker build --tag $NAME:1.0 -f ./docker/Dockerfile ./

docker run -idt --rm --name $NAME $NAME:1.0 /start.sh
