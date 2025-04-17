# yt-demucs

yt-demucs is an easy-to-use web GUI, currently capable of downloading audio files
from [YouTube](https://youtube.com) and separating drums, bass and vocals from the audio,
so you can set the volume of those instruments independently during playback.

It also features beat-detection, a metronome (tick on the detected beats, as well as a "normal"
metronome).

## Used projects

yt-demucs depends a few other components:

- [Bootstrap](https://getbootstrap.com)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for downloading audio data from YouTube
- [demucs](https://github.com/adefossez/demucs) for separating the instruments
- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) for visualization of the audio
- [audiowaveform](https://github.com/bbc/audiowaveform), also for visualization of the audio
- [librosa](https://librosa.org) for beat detection

The metronome code, as well as the audio synchronization, was implemented by myself.
Even if this is a bit hacky right now, it works like a charm.

Note, that it's recommended to run this on a Cuda-enabled machine.

## Requirements

- [Docker](https://docker.io)
- [NVIDIA Container Toolkit](https://github.com/NVIDIA/nvidia-container-toolkit) (optional, but highly recommended)

## Installation

```bash
git clone https://github.com/MarkRohrbacher/yt-demucs
cd yt-demucs
./build.sh
```

## Start

To start the container, use one of the start scripts:

With GPU support:
```bash
./start.sh
```

Without GPU support:
```bash
./start-cpu.sh
```

You can access the container by browsing to http://127.0.0.1


