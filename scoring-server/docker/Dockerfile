# syntax=docker/dockerfile:1
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y python3-dev

COPY ./python /judger

COPY ./docker/start.sh /start.sh