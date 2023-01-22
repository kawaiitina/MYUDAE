import * as PIXI from "pixi.js";
import judgement_line_blue from "../assets/sprite/judgement_line_blue.png";
import judgement_line_pink from "../assets/sprite/judgement_line_pink.png";
import spinner from "../assets/sprite/spinner.png";

const JUDGEMENT_LINE_X = 400;
const JUDEGMENT_LINE_TOP_Y = 380;
const JUDEGMENT_LINE_BOTTOM_Y = 680;

const blue = PIXI.Sprite.from(judgement_line_blue);
blue.anchor.set(0.5);
blue.x = JUDGEMENT_LINE_X;
blue.y = JUDEGMENT_LINE_TOP_Y;
blue.scale.set(0.5);
const pink = PIXI.Sprite.from(judgement_line_pink);
pink.anchor.set(0.5);
pink.x = JUDGEMENT_LINE_X;
pink.y = JUDEGMENT_LINE_BOTTOM_Y;
pink.scale.set(0.5);
const spinnerTop = PIXI.Sprite.from(spinner);
spinnerTop.anchor.set(0.5);
spinnerTop.x = JUDGEMENT_LINE_X;
spinnerTop.y = JUDEGMENT_LINE_TOP_Y;
spinnerTop.scale.set(0.5);
const spinnerBottom = PIXI.Sprite.from(spinner);
spinnerBottom.anchor.set(0.5);
spinnerBottom.x = JUDGEMENT_LINE_X;
spinnerBottom.y = JUDEGMENT_LINE_BOTTOM_Y;
spinnerBottom.scale.set(0.5);
const container = new PIXI.Container();
container.alpha = 0.8;
container.addChild(spinnerTop);
container.addChild(spinnerBottom);
container.addChild(blue);
container.addChild(pink);

let bpm;
let playbackRate;

function init(options) {
  bpm = options.score.bpm;
  playbackRate = options.playbackRate;
}

function draw(elapsedTime) {
  const bounceInterval = ((60 * 1000) / (bpm * playbackRate)) * 2;
  const bounceProgress = (elapsedTime % bounceInterval) / bounceInterval;
  let scale;
  if (elapsedTime < 0) {
    if (bounceProgress < 0.9) {
      scale = 0.6 - 0.1 * ((bounceProgress + 1) / 0.9);
    } else {
      scale = 0.5 + (bounceProgress + 1 - 0.9);
    }
  } else {
    if (bounceProgress < 0.9) {
      scale = 0.6 - 0.1 * (bounceProgress / 0.9);
    } else {
      scale = 0.5 + (bounceProgress - 0.9);
    }
  }
  spinnerTop.scale.set(scale);
  spinnerBottom.scale.set(scale);

  const rotationInterval = ((60 * 1000) / (bpm * playbackRate)) * 3;
  const rotationProgress = elapsedTime / rotationInterval;
  const rotation = -rotationProgress * 2 * Math.PI;
  spinnerTop.rotation = rotation;
  spinnerBottom.rotation = rotation;
}

function stop() {}

const judgementLine = { container, init, draw, stop };
export default judgementLine;
export { JUDGEMENT_LINE_X, JUDEGMENT_LINE_TOP_Y, JUDEGMENT_LINE_BOTTOM_Y };
