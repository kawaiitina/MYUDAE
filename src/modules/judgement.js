import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import {
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
} from "./judgement-line.js";

const container = new PIXI.Container();
let judgements = [];
let styles;
const TIMING_WINDOW = {
  PERFECT: 50,
  GREAT: 130,
};

PIXI.Assets.load("FredokaOne").then((font) => {
  const FredokaOne = font.family;
  styles = {
    perfect: new PIXI.TextStyle({
      align: "center",
      fontFamily: FredokaOne,
      fontSize: 100,
      fill: [0xfe3894, 0xff7dc9],
      fillGradientStops: [0.49, 0.5],
      stroke: 0xffffff,
      strokeThickness: 5,
    }),
    great: new PIXI.TextStyle({
      align: "center",
      fontFamily: FredokaOne,
      fontSize: 100,
      fill: [0x953cfa, 0xbe3cfa],
      fillGradientStops: [0.49, 0.5],
      stroke: 0xffffff,
      strokeThickness: 5,
    }),
    early: new PIXI.TextStyle({
      align: "center",
      fontFamily: FredokaOne,
      fontSize: 30,
      fill: 0x37cafb,
      stroke: 0x0048ff,
      strokeThickness: 5,
    }),
    late: new PIXI.TextStyle({
      align: "center",
      fontFamily: FredokaOne,
      fontSize: 30,
      fill: 0xff009d,
      stroke: 0x9c1847,
      strokeThickness: 5,
    }),
  };
});

function getText1(timeDelta) {
  if (
    -TIMING_WINDOW.PERFECT <= timeDelta &&
    timeDelta <= TIMING_WINDOW.PERFECT
  ) {
    return new PIXI.Text("PERFECT", styles.perfect);
  } else if (
    timeDelta <= TIMING_WINDOW.GREAT &&
    timeDelta >= -TIMING_WINDOW.GREAT
  ) {
    return new PIXI.Text("GREAT", styles.great);
  }
}
function getText2(timeDelta) {
  if (-10 <= timeDelta && timeDelta <= 10) {
    return new PIXI.Text("");
  }
  if (timeDelta < 0) {
    return new PIXI.Text(timeDelta.toFixed(0), styles.early);
  } else {
    return new PIXI.Text("+" + timeDelta.toFixed(0), styles.late);
  }
}

class Judgement {
  constructor(lane, timeDelta) {
    this.birth = performance.now();
    this.lifespan = 800;
    this.isAlive = true;

    const x = JUDGEMENT_LINE_X;
    const y = lane === "top" ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;

    this.y = y;

    this.container = new PIXI.Container();
    this.text1 = getText1(timeDelta);
    this.text1.anchor.set(0.5);
    this.text1.x = x;
    this.text1.y = y;
    this.text2 = getText2(timeDelta);
    this.text2.anchor.set(0.5);
    this.text2.x = x;
    this.text2.y = y + 60;

    this.container.pivot.x = x;
    this.container.pivot.y = y;
    this.container.x = x;
    this.container.y = y;
    this.container.addChild(this.text1);
    this.container.addChild(this.text2);

    container.addChild(this.container);
  }
  update(now) {
    const elapsedTime = now - this.birth;
    if (elapsedTime > this.lifespan) {
      this.isAlive = false;
      return;
    }
    const progress = elapsedTime / this.lifespan;

    if (progress < 0.1) {
      this.container.y = this.y - 100 - progress * 500;
      this.container.scale.x = 0.8 + progress * 4;
      this.container.scale.y = 0.8 + progress * 4;
    } else if (progress < 0.5) {
      this.container.scale.x = 1;
      this.container.scale.y = 1;
    } else {
      this.container.y = this.y - 150 - (progress - 0.5) * 30;
      this.container.alpha = Math.min(5 - 5 * progress, 1);
    }
  }
  destroy() {
    this.container.destroy();
    this.text1.destroy();
    this.text2.destroy();
  }
}

function update(now) {
  judgements.forEach((judgement) => {
    judgement.update(now);
    if (!judgement.isAlive) {
      judgement.destroy();
    }
  });
  judgements = judgements.filter((judgement) => judgement.isAlive);
}
function stop() {
  judgements.forEach((judgement) => {
    judgement.destroy();
  });
  judgements = [];
}

function add(lane, timeDelta) {
  judgements.push(new Judgement(lane, timeDelta));
}
const judgement = {
  container,
  update,
  stop,
  add,
};
export default judgement;
export { TIMING_WINDOW };
