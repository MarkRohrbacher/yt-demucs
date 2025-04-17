FROM nvcr.io/nvidia/pytorch:25.02-py3

RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --yes \
        ffmpeg && \
    rm -rf /var/lib/apt/lists/*

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

COPY fs/etc/apt/sources.list.d/chris-needham-ubuntu-ppa-noble.sources /etc/apt/sources.list.d/chris-needham-ubuntu-ppa-noble.sources

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --yes \
        audiowaveform && \
    rm -rf /var/lib/apt/lists/*

COPY fs /

VOLUME /app/static/music

CMD [ "gunicorn", "-w", "4", "-b", "0.0.0.0", "app:app" ]
