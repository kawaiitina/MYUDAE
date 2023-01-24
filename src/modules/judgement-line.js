import * as PIXI from "pixi.js";
import {
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
} from "./const.js";
import { sprites } from "./pixi.js";

const judgementLine = {
  container: new PIXI.Container(),
  bpm: 0,
  playbackRate: 1,
  init(score, playbackRate) {
    this.bpm = score.bpm;
    this.playbackRate = playbackRate;

    this.blue = PIXI.Sprite.from(sprites.judgementLineBlue);
    this.blue.anchor.set(0.5);
    this.blue.x = JUDGEMENT_LINE_X;
    this.blue.y = JUDEGMENT_LINE_TOP_Y;
    this.blue.scale.set(0.5);

    this.pink = PIXI.Sprite.from(sprites.judgementLinePink);
    this.pink.anchor.set(0.5);
    this.pink.x = JUDGEMENT_LINE_X;
    this.pink.y = JUDEGMENT_LINE_BOTTOM_Y;
    this.pink.scale.set(0.5);

    this.spinnerTop = PIXI.Sprite.from(sprites.spinner);
    this.spinnerTop.anchor.set(0.5);
    this.spinnerTop.x = JUDGEMENT_LINE_X;
    this.spinnerTop.y = JUDEGMENT_LINE_TOP_Y;
    this.spinnerTop.scale.set(0.5);

    this.spinnerBottom = PIXI.Sprite.from(sprites.spinner);
    this.spinnerBottom.anchor.set(0.5);
    this.spinnerBottom.x = JUDGEMENT_LINE_X;
    this.spinnerBottom.y = JUDEGMENT_LINE_BOTTOM_Y;
    this.spinnerBottom.scale.set(0.5);

    this.container.alpha = 0.6;
    this.container.addChild(
      this.blue,
      this.pink,
      this.spinnerTop,
      this.spinnerBottom
    );
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
    this.spinnerTop.scale.set(scale);
    this.spinnerBottom.scale.set(scale);

    const rotationInterval = ((60 * 1000) / (this.bpm * this.playbackRate)) * 3;
    const rotationProgress = elapsedTime / rotationInterval;
    const rotation = -rotationProgress * 2 * Math.PI;
    this.spinnerTop.rotation = rotation;
    this.spinnerBottom.rotation = rotation;
  },
  stop() {
    this.container.removeChild(
      this.blue,
      this.pink,
      this.spinnerTop,
      this.spinnerBottom
    );
    this.blue.destroy();
    this.pink.destroy();
    this.spinnerTop.destroy();
    this.spinnerBottom.destroy();
  },
};

export default judgementLine;
