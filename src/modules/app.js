import pixi from "./pixi.js";
import bar from "./bar.js";
import note from "./note.js";
import longNote from "./longnote.js";
import judgementLine from "./judgement-line.js";
import input from "./input.js";
import effect from "./effect.js";
import uiText from "./ui-text.js";
import combo from "./combo.js";
import setting from "./setting.js";

pixi.stage.addChild(
  bar.container,
  judgementLine.container,
  effect.container,
  longNote.container,
  note.container,
  combo.container,
  uiText.container
);

// 유튜브는 한 마디(4박자) 전부터 시작함.
// videoCurrentTime이 options.score.videoStartTime이 될 때가 startTime임
// 첫 번째 박자에 있는 노트가 판정선에 닿을 때 elapsedTime == 0, performance.now() == startTime

let raf;

function play(score, playbackRate, videoCurrentTime) {
  const startTime =
    performance.now() +
    (score.videoStartTime * 1000 - videoCurrentTime) / playbackRate;

  judgementLine.init(score, playbackRate);
  note.init(score, playbackRate);
  longNote.init(score, playbackRate);
  bar.init(score, playbackRate);
  input.init(startTime);

  update(startTime);
}
function update(startTime) {
  const elapsedTime = performance.now() - startTime;

  input.update();
  note.update(elapsedTime);
  longNote.update(elapsedTime);
  judgementLine.update(elapsedTime);
  bar.update(elapsedTime);

  raf = requestAnimationFrame(function () {
    update(startTime);
  });
}
function stop() {
  cancelAnimationFrame(raf);
  input.stop();
  bar.stop();
  judgementLine.stop();
  longNote.stop();
  note.stop();
}
const app = { pixi, play, stop, setting };
export default app;
