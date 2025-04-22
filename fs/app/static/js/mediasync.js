'use strict';

export class MediaSync {
    constructor(master, slaves) {
        master.addEventListener("seeking", () => {
            for (let e of slaves) {
                e.currentTime = master.currentTime;
            }
        });
        master.addEventListener("seeked", () => {
            for (let e of slaves) {
                e.currentTime = master.currentTime;
            }
        });
        master.addEventListener("play", () => {
            for (let e of slaves) {
                e.play();
            }
        });
        master.addEventListener("pause", () => {
            for (let e of slaves) {
                e.pause();
            }
        });
        master.addEventListener("ratechange", () => {
            for (let e of slaves) {
                e.playbackRate = master.playbackRate;
            }
        });

        master.addEventListener("timeupdate", () => {
            const playbackRate = master.playbackRate;
            const currentTime = master.currentTime;
            for (let e of slaves) {
                const diff = e.currentTime - currentTime;
                if (Math.abs(diff) < .01) {
                    if (e.playbackRate != playbackRate) {
                        console.debug(e.id + " soft sync done", currentTime, diff);
                        e.playbackRate = playbackRate;
                    }
                } else if (Math.abs(diff) > .2) {
                    console.debug(e.id + " hard sync", currentTime, diff);
                    e.playbackRate = playbackRate;
                    e.currentTime = master.currentTime;
                } else {
                    if (diff > 0) {
                        e.playbackRate = playbackRate * .95;
                        console.debug(e.id + " soft sync (slow down)", currentTime, diff);
                    } else {
                        e.playbackRate = playbackRate * 1.05;
                        console.debug(e.id + " soft sync (speed up)", currentTime, diff);
                    }
                }
            }
        });
    }
};

