#!/bin/bash

NVIDIA_SETTINGS="--gpus all --ipc=host --ulimit memlock=-1 --ulimit stack=67108864"

[ -d ./mount/music ] || mkdir -p ./mount/music

docker run -d \
    $NVIDIA_SETTINGS \
    --restart=unless-stopped \
    --name=yt-demucs \
    --publish 80:8000 \
    -v ./mount/music:/app/static/music \
    yt-demucs
