import * as PIXI from "pixi.js";
// import background from "./background";
import bar from "./bar";
import note from "./note";
import longNote from "./longnote";
import judgementLine from "./judgement line";
import input from "./input";
import effect from "./effect";
import judgementText from "./judgement text";
import sound from "./sound";

// 첫 번째 박자가 판정선에 닿을 때 elapsedTime == 0
// 유튜브는 한 마디(4박자) 전부터 시작 (elapsedTime은 음수부터 시작)

const pixi = new PIXI.Application({
  width: 1920,
  height: 1080,
  background: 0x181818,
  // antialias: true,
  backgroundAlpha: 0.9,
  // backgroundAlpha: 0,
});

function init(options) {
  const { score, playbackRate, userOffset } = options;
  const { bpm } = score;
  function noteToTime(note) {
    return (note / 12) * (60 / (bpm * playbackRate)) * 1000 + userOffset;
  }
  function getNoteColor(note, longNotes, lane) {
    const index = longNotes[lane].findIndex((longNote) => {
      return longNote.start <= note && note <= longNote.end;
    });
    if (index === -1) {
      if (lane === "top") {
        return "blue";
      } else if (lane === "bottom") {
        return "pink";
      }
    } else {
      return "yellow";
    }
  }

  const notes = {
    top: score.notes.top.map((note) => {
      return {
        time: noteToTime(note),
        color: getNoteColor(note, score.longNotes, "top"),
      };
    }),
    bottom: score.notes.bottom.map((note) => {
      return {
        time: noteToTime(note),
        color: getNoteColor(note, score.longNotes, "bottom"),
      };
    }),
  };
  const longNotes = {
    top: score.longNotes.top.map((longNote) => {
      return {
        startTime: noteToTime(longNote.start),
        endTime: noteToTime(longNote.end),
        holdStartTime: null,
        releaseTime: null,
        code: null,
        isHeld: false,
        hasBeenHeld: false,
        isReleased: false,
      };
    }),
    bottom: score.longNotes.bottom.map((longNote) => {
      return {
        startTime: noteToTime(longNote.start),
        endTime: noteToTime(longNote.end),
        holdStartTime: null,
        releaseTime: null,
        code: null,
        isHeld: false,
        hasBeenHeld: false,
        isReleased: false,
      };
    }),
  };
  const bars = Array(score.beats)
    .fill(null)
    .map((el, i) => {
      return {
        time: (60 / (bpm * playbackRate)) * 1000 * i,
        color: score.bars.includes(i) ? "red" : "gray",
      };
    });

  const startTime =
    performance.now() +
    (options.score.offset * 1000 - options.videoCurrentTime) / playbackRate;

  const keyToCode = {
    Q: "KeyQ",
    W: "KeyW",
    E: "KeyE",
    R: "KeyR",
    T: "KeyT",
    Y: "KeyY",
    U: "KeyU",
    I: "KeyI",
    O: "KeyO",
    P: "KeyP",
    "[": "BracketLeft",
    "]": "BracketRight",
    A: "KeyA",
    S: "KeyS",
    D: "KeyD",
    F: "KeyF",
    G: "KeyG",
    H: "KeyH",
    J: "KeyJ",
    K: "KeyK",
    L: "KeyL",
    ";": "Semicolon",
    "'": "Quote",
    Z: "KeyZ",
    X: "KeyX",
    C: "KeyC",
    V: "KeyV",
    B: "KeyB",
    N: "KeyN",
    M: "KeyM",
    ",": "Comma",
    ".": "Period",
    "/": "Slash",
  };
  const keys = {
    top: options.keyTop.map((key) => keyToCode[key]),
    bottom: options.keyBottom.map((key) => keyToCode[key]),
  };

  // pixi.stage.addChild(background.container);
  pixi.stage.addChild(bar.container);
  pixi.stage.addChild(judgementLine.container);
  pixi.stage.addChild(effect.container);
  pixi.stage.addChild(judgementText.container);
  pixi.stage.addChild(longNote.container);
  pixi.stage.addChild(note.container);
  input.init();

  return {
    notes,
    longNotes,
    bars,
    startTime,
    noteSpeed: options.noteSpeed,
    keys,
    bpm: score.bpm,
    playbackRate,
  };
}

let updateInterval = null;
// let data = null;
function update(data) {
  const {
    notes,
    longNotes,
    bars,
    startTime,
    noteSpeed,
    keys,
    bpm,
    playbackRate,
  } = data;
  const now = performance.now();
  const elapsedTime = now - startTime;

  input.update({
    notes,
    longNotes,
    startTime,
    keys,
  });
  judgementLine.update(elapsedTime, bpm, playbackRate);
  bar.update(bars, noteSpeed, elapsedTime);
  note.update(notes, noteSpeed, elapsedTime);
  longNote.update(longNotes, noteSpeed, elapsedTime);
  effect.update(now);
  judgementText.update(now);
  // raf = requestAnimationFrame(function () {
  //   update(data);
  // });
}
function play(options) {
  const data = init(options);

  updateInterval = setInterval(function () {
    update(data);
  }, 4);
}
function stop() {
  // cancelAnimationFrame(raf);
  clearInterval(updateInterval);
  input.stop();
  // pixi.stage.removeChild(background.container);
  pixi.stage.removeChild(bar.container);
  pixi.stage.removeChild(judgementLine.container);
  pixi.stage.removeChild(effect.container);
  pixi.stage.removeChild(judgementText.container);
  pixi.stage.removeChild(longNote.container);
  pixi.stage.removeChild(note.container);
}
function setting(option) {
  if (option?.volume) {
    sound.changeVolume(option.volume);
  }
}
export { pixi, play, stop, setting };
