#!/bin/bash

if [ -z "$NAME" ]
then
  exit
fi

docker kill $NAME

docker run --cpuset-cpus=$1 --cpus=1 -idt --rm --name $NAME scoring_docker /start.sh
