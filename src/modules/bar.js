import * as PIXI from "pixi.js";
import { JUDGEMENT_LINE_X } from "./judgement-line";
import bar_red from "../assets/sprite/bar_red.png";
import bar_gray from "../assets/sprite/bar_gray.png";

let bars;
let noteSpeed;

const container = new PIXI.Container();
const sprites = {
  red: Array(10)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(bar_red);
      sprite.y = 540;
      sprite.anchor.set(0.5);
      sprite.alpha = 0.5;
      return sprite;
    }),
  gray: Array(10)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(bar_gray);
      sprite.y = 540;
      sprite.anchor.set(0.5);
      sprite.alpha = 0.5;
      return sprite;
    }),
};

function init(options) {
  const { score, playbackRate, userOffset } = options;
  bars = Array(score.beats)
    .fill(null)
    .map((el, i) => {
      return {
        time: (60 / (score.bpm * playbackRate)) * 1000 * i + userOffset,
        color: score.bars.includes(i) ? "red" : "gray",
      };
    });
  noteSpeed = options.noteSpeed;
  return Array(score.beats)
    .fill(null)
    .map((el, i) => {
      return {
        time: (60 / (score.bpm * playbackRate)) * 1000 * i + userOffset,
        color: score.bars.includes(i) ? "red" : "gray",
      };
    });
}

function update(elapsedTime) {
  function getBarX(barTime, elapsedTime, noteSpeed) {
    return JUDGEMENT_LINE_X + 1.5 * (barTime - elapsedTime) * noteSpeed;
  }
  while (elapsedTime - bars[0]?.time > 1000) {
    bars.shift();
  }
  sprites.red.forEach((sprite) => container.removeChild(sprite));
  sprites.gray.forEach((sprite) => container.removeChild(sprite));
  bars.forEach((bar, i) => {
    if (i >= 10) {
      return;
    }
    if (bar.color === "red") {
      sprites.red[i].x = getBarX(bar.time, elapsedTime, noteSpeed);
      container.addChild(sprites.red[i]);
    } else if (bar.color === "gray") {
      sprites.gray[i].x = getBarX(bar.time, elapsedTime, noteSpeed);
      container.addChild(sprites.gray[i]);
    }
  });
}

function stop() {
  sprites.red.forEach((sprite) => container.removeChild(sprite));
  sprites.gray.forEach((sprite) => container.removeChild(sprite));
  bars = [];
}

const note = { container, init, update, stop };
export default note;
