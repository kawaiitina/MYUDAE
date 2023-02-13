import * as PIXI from "pixi.js";
import {
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
} from "./const.js";
import { sprites } from "./pixi.js";
import setting from "./setting.js";

const blue = PIXI.Sprite.from(sprites.judgementLineBlue);
blue.anchor.set(0.5);
blue.x = JUDGEMENT_LINE_X;
blue.y = JUDEGMENT_LINE_TOP_Y;
blue.scale.set(0.5);

const pink = PIXI.Sprite.from(sprites.judgementLinePink);
pink.anchor.set(0.5);
pink.x = JUDGEMENT_LINE_X;
pink.y = JUDEGMENT_LINE_BOTTOM_Y;
pink.scale.set(0.5);

const spinnerTop = PIXI.Sprite.from(sprites.spinner);
spinnerTop.anchor.set(0.5);
spinnerTop.x = JUDGEMENT_LINE_X;
spinnerTop.y = JUDEGMENT_LINE_TOP_Y;
spinnerTop.scale.set(0.5);

const spinnerBottom = PIXI.Sprite.from(sprites.spinner);
spinnerBottom.anchor.set(0.5);
spinnerBottom.x = JUDGEMENT_LINE_X;
spinnerBottom.y = JUDEGMENT_LINE_BOTTOM_Y;
spinnerBottom.scale.set(0.5);

const container = new PIXI.Container();
container.alpha = 0.6;
container.addChild(blue, pink, spinnerTop, spinnerBottom);

const judgementLine = {
  container,
  sprites: {
    blue,
    pink,
    spinnerTop,
    spinnerBottom,
  },
  bpm: 0,
  playbackRate: 1,
  init() {
    this.bpm = setting.score.bpm;
    this.playbackRate = setting.playbackRate;
  },
  update(elapsedTime) {
    const bounceInterval = (60 * 1000) / (this.bpm * this.playbackRate);
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
    this.sprites.spinnerTop.scale.set(scale);
    this.sprites.spinnerBottom.scale.set(scale);

    const rotationInterval = ((60 * 1000) / (this.bpm * this.playbackRate)) * 3;
    const rotationProgress = elapsedTime / rotationInterval;
    const rotation = -rotationProgress * 2 * Math.PI;
    this.sprites.spinnerTop.rotation = rotation;
    this.sprites.spinnerBottom.rotation = rotation;
  },
};

export default judgementLine;
