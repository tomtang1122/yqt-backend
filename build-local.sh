#!/bin/bash

docker build --no-cache --build-arg BASE_PATH=/admin-web -t lark-tower-admin-front  .