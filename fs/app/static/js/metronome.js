'use strict';

export class Metronome {
    #audioCtx;
    #silence;
    #audioBuffer;
    #speed;
    #listeners;
    #interval;
    #nextTick;

    constructor(tickUrl) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.#audioCtx = new AudioContext();
        fetch("/static/sounds/metronome.flac")
            .then(resp => resp.arrayBuffer())
            .then(buf => this.#audioCtx.decodeAudioData(buf))
            .then(audioBuffer => this.#audioBuffer = audioBuffer);

        this.METRONOME_TICK = .1;
        this.#speed = 60;
        this.#listeners = new Map();
    }

    #tick() {
        const currentTime = this.#audioCtx.currentTime;
        if (this.#nextTick === undefined) {
            this.#nextTick = currentTime + .1;
        }
        if (currentTime > this.#nextTick - 2*this.METRONOME_TICK) {
            if (this.#nextTick > currentTime) {
                const source = this.#audioCtx.createBufferSource();
                source.buffer = this.#audioBuffer;
                source.connect(this.#audioCtx.destination);
                source.start(this.#nextTick);
            }
            this.#nextTick += (60 / this.#speed);
        }
    }

    #init() {
        if (this.#silence === undefined) {
            this.#silence = this.#audioCtx.createBufferSource();
            this.#silence.loop = true;
            this.#silence.connect(this.#audioCtx.destination);
            this.#silence.start();
        }
    }

    start() {
        if (!this.running) {
            this.#init();

            this.#nextTick = undefined;
            this.#interval = setInterval(() => this.#tick(), 1000 * this.METRONOME_TICK);
            this.#emit("started")
        }
    }

    stop() {
        if (this.#interval !== undefined) {
            clearInterval(this.#interval);
            this.#interval = undefined;
            this.#emit("stopped")
        }
    }

    on(what, cb) {
        this.#listeners.has(what) || this.#listeners.set(what, []);
        this.#listeners.get(what).push(cb);
    }

    off(what, cb = true) {
        if (cb === true) {
            this.#listeners.delete(what);
        } else {
            const listeners = this.#listeners.get(what);
            if (listeners) {
                listeners.set(what, listeners.filter((v) => !(v === cb)));
            }
        }
    }

    #emit(what, ...args) {
        const listeners = this.#listeners.get(what);
        if (listeners) {
            listeners.forEach((cb) => {
                cb(...args);
            });
        }
    }

    set speed(speed) {
        this.#speed = Math.max(30, Math.min(speed, 400));
        this.#emit("speedchanged", this.#speed);
    }
    get speed() {
        return this.#speed;
    }
    get running() {
        return !(this.#interval === undefined);
    }
    set running(onoff) {
        onoff = !!onoff;
        if (this.running == onoff)
            return;

        if (onoff) {
            this.start();
        } else {
            this.stop();
        }
    }
};
