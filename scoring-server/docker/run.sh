#!/bin/bash

if [ -z "$NAME" ]
then
  exit
fi

docker kill $NAME

docker run -idt --rm --name $NAME scoring_docker /start.sh
