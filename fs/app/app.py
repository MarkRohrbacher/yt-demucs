import eventlet
import subprocess
import filecache
import base64
from pathlib import Path
from flask import Flask, render_template, request, Response, send_from_directory
from glob import glob
from yt_dlp import YoutubeDL
import json

app = Flask(__name__)


@filecache.filecache(filecache.WEEK)
def _cached_get_meta(youtube_id):
    with YoutubeDL({"quiet": True}) as ydl:
        meta = ydl.extract_info(youtube_id, download=False)
        return json.dumps(meta)


@filecache.filecache(filecache.WEEK)
def _cached_search_youtube(q):
    with YoutubeDL({"quiet": True}) as ydl:
        all_info = ydl.extract_info(f"ytsearch5:{q}", download=False)
        return json.dumps(all_info['entries'])


def get_meta(youtube_id):
    s = _cached_get_meta(youtube_id)
    res = json.loads(_cached_get_meta(youtube_id))
    # remove unneeded slack
    res['fragments'] = None
    res['formats'] = None
    res['thumbnails'] = None
    res['automatic_captions'] = None
    res['subtitles'] = None
    res['heatmap'] = None
    res['requested_formats'] = None
    return res


def search_youtube(q):
    s = _cached_search_youtube(q)
    return json.loads(_cached_search_youtube(q))


@app.route("/", defaults={"path": ""})
@app.route("/library", defaults={"path": ""})
@app.route("/<path:path>")
def mainpage(path):
    files = []
    for file in glob("*", root_dir="static/music"):
        try:
            files.append(get_meta(file))
        except:
            pass

    return render_template("library.html", files=files)


@app.route("/play/<youtube_id>")
def play(youtube_id):
    try:
        meta = get_meta(youtube_id)
        return render_template("play.html", file=meta)
    except Exception as e:
        print(f"Got Exception: {e}")
        return "File not found", 404

@app.route("/search")
def search():
    q = request.args.get('q', '')
    meta = []
    if q != '':
        meta = search_youtube(q)
    return render_template("search.html", files=meta, query=q)


@app.route("/preview/<youtube_id>")
def preview(youtube_id):
    def generate():
        proc = subprocess.Popen(
                [ "yt-dlp", "--audio-format", "flac", "--extract-audio", "-o", "-", youtube_id ],
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                text=False,
                )
        while True:
            data = proc.stdout.read(4096)
            if not data:
                break
            yield data
        proc.wait()

    return Response(generate(), mimetype='audio/x-flac')


@app.route("/convert/<youtube_id>")
def convert(youtube_id):
    def generate():
        yield f"Converting {youtube_id}"
        proc = subprocess.Popen(
                [ "/convert", youtube_id ],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                )
        for line in proc.stdout:
            yield line
        proc.wait()
        yield "Finished."

    return Response(generate(), mimetype='text/plain')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, server='eventlet')

