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
- About 7GB free disk space (and enough space for the audio)

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

## Usage

When opening the screen, you will be welcomed by an empty library.
The only useful action here is to "Search on Youtube":

![Empty library](/screenshots/empty-library.png?raw=true)

Clicking the "Search on YouTube" link sends you to the search page:

![Search page](/screenshots/search.png?raw=true)

After entering a search query, it will return the 5 best matches from YouTube:

![Search result](/screenshots/searchresult.png?raw=true)

Pressing the red button (The cloud with the "+") will start the conversion and add
the match to your library. As for now, you should wait until the conversion is completed
(no error handling here yet)

![Conversion](/screenshots/conversion.png?raw=true)

When the conversion is completed, you will be automatically redirected to the library:

![Library](/screenshots/library.png?raw=true)

When clicking on the new entry, you will be redirected to the replay screen:

![Replay screen](/screenshots/play.png?raw=true)

