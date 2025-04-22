FROM nvcr.io/nvidia/pytorch:25.02-py3

COPY fs/etc/apt/sources.list.d/chris-needham-ubuntu-ppa-noble.sources /etc/apt/sources.list.d/chris-needham-ubuntu-ppa-noble.sources

RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --yes \
        ffmpeg audiowaveform && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

RUN pip install --no-cache-dir --break-system-packages --upgrade \
        demucs yt-dlp diffq && \
    rm -rf /tmp/.cache/pip

RUN mkdir /models && \
    demucs /tmp/silence.mp3 --out /tmp/output && \
    demucs /tmp/silence.mp3 -n mdx_extra_q --out /tmp/output && \
    rm -rf /tmp/output

WORKDIR /app

COPY fs/app/requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt && \
    rm -rf .cache/pip

COPY fs /

VOLUME /app/static/music

EXPOSE 8000

CMD [ "gunicorn", "--workers", "16", "--bind", "0.0.0.0", "--timeout", "0", "app:app" ]
