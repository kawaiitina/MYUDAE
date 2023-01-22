import * as PIXI from "pixi.js";
import pixi, { ticker } from "./pixi.js";
import bar from "./bar.js";
import note from "./note.js";
import longNote from "./longnote.js";
import judgementLine from "./judgement-line.js";
import input from "./input.js";
import effect from "./effect.js";
import judgement from "./judgement.js";
import sound from "./sound.js";
import uiText from "./ui-text.js";
import combo from "./combo.js";

pixi.stage.addChild(
  bar.container,
  judgementLine.container,
  effect.container,
  judgement.container,
  longNote.container,
  note.container,
  combo.container,
  uiText.container
);

let startTime;

function init(options) {
  // 유튜브는 한 마디(4박자) 전부터 시작함.
  // videoCurrentTime이 options.score.offset이 될 때가 startTime임
  startTime =
    performance.now() +
    (options.score.offset * 1000 - options.videoCurrentTime) /
      options.playbackRate;

  judgementLine.init(options);
  note.init(options);
  longNote.init(options);
  bar.init(options);
  input.init(options, startTime);
}

let updateInterval = null;
function update() {
  // 첫 번째 박자에 있는 노트가 판정선에 닿을 때 elapsedTime == 0
  const now = performance.now();
  const elapsedTime = now - startTime;

  input.update();
  judgementLine.update(elapsedTime);
  bar.update(elapsedTime);
  note.update(elapsedTime);
  longNote.update(elapsedTime);
  // raf = requestAnimationFrame(function () {
  //   update(data);
  // });
}
function play(options) {
  init(options);

  updateInterval = setInterval(update, 4);
}
function stop() {
  // cancelAnimationFrame(raf);
  clearInterval(updateInterval);
  input.stop();
  bar.stop();
  judgementLine.stop();
  longNote.stop();
  note.stop();
}
function setting(option) {
  if (option?.volume) {
    sound.changeVolume(option.volume);
  }
  if (option?.score) {
    uiText.changeScore(option.score);
  }
  if (option?.playbackRate) {
    uiText.changePlaybackRate(option.playbackRate);
  }
}
export { pixi, play, stop, setting };
