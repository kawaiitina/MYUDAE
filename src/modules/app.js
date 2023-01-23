import pixi from "./pixi.js";
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

// 유튜브는 한 마디(4박자) 전부터 시작함.
// videoCurrentTime이 options.score.offset이 될 때가 startTime임
// 첫 번째 박자에 있는 노트가 판정선에 닿을 때 elapsedTime == 0, performance.now() == startTime

let raf;
function update(startTime) {
  const elapsedTime = performance.now() - startTime;

  input.update();
  note.update(elapsedTime);
  longNote.update(elapsedTime);

  judgementLine.draw(elapsedTime);
  bar.draw(elapsedTime);
  note.draw(elapsedTime);
  longNote.draw(elapsedTime);

  raf = requestAnimationFrame(function () {
    update(startTime);
  });
}

function play(options) {
  const startTime =
    performance.now() +
    (options.score.offset * 1000 - options.videoCurrentTime) /
      options.playbackRate;

  judgementLine.init(options);
  note.init(options);
  longNote.init(options);
  bar.init(options);
  input.init(options, startTime);

  update(startTime);
}
function stop() {
  cancelAnimationFrame(raf);
  input.stop();
  bar.stop();
  judgementLine.stop();
  longNote.stop();
  note.stop();
}
function setting(option) {
  if (option?.sfxVolume) {
    sound.changeSfxVolume(option.sfxVolume);
  }
  if (option?.score) {
    uiText.changeScore(option.score);
  }
  if (option?.playbackRate) {
    uiText.changePlaybackRate(option.playbackRate);
  }
}
export { pixi, play, stop, setting };
