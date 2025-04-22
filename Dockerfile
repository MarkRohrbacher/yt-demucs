FROM nvcr.io/nvidia/cuda:11.8.0-base-ubuntu22.04

COPY fs/etc/apt/sources.list.d/chris-needham-ubuntu-ppa-jammy.sources /etc/apt/sources.list.d/chris-needham-ubuntu-ppa-jammy.sources

RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --yes \
        ffmpeg audiowaveform python3 python3-pip && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

RUN pip install --no-cache-dir --upgrade \
        demucs yt-dlp diffq && \
    rm -rf /tmp/.cache/pip

RUN mkdir /models && \
    demucs /tmp/silence.mp3 --out /tmp/output && \
    rm -rf /tmp/output

WORKDIR /app

COPY fs/app/requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt && \
    rm -rf .cache/pip

COPY fs /

VOLUME /app/static/music

EXPOSE 8000

CMD [ "gunicorn", "--worker-class", "gevent", "--workers", "8", "--worker-connections", "1000", "--bind", "0.0.0.0", "--timeout", "0", "app:app" ]
