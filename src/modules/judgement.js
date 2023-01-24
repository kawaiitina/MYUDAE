import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import {} from "./judgement-line.js";
import { ticker } from "./pixi.js";
import {
  TOP,
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
  TIMING_WINDOW,
} from "./const.js";
import { fonts } from "./pixi.js";

const container = new PIXI.Container();
const judgements = [];
const styles = {
  perfect: new PIXI.TextStyle({
    align: "center",
    fontFamily: fonts.FredokaOne.family,
    fontSize: 100,
    fill: [0xfe3894, 0xff7dc9],
    fillGradientStops: [0.49, 0.5],
    stroke: 0xffffff,
    strokeThickness: 5,
  }),
  great: new PIXI.TextStyle({
    align: "center",
    fontFamily: fonts.FredokaOne.family,
    fontSize: 100,
    fill: [0x953cfa, 0xbe3cfa],
    fillGradientStops: [0.49, 0.5],
    stroke: 0xffffff,
    strokeThickness: 5,
  }),
  early: new PIXI.TextStyle({
    align: "center",
    fontFamily: fonts.FredokaOne.family,
    fontSize: 30,
    fill: 0x37cafb,
    stroke: 0x0048ff,
    strokeThickness: 5,
  }),
  late: new PIXI.TextStyle({
    align: "center",
    fontFamily: fonts.FredokaOne.family,
    fontSize: 30,
    fill: 0xff009d,
    stroke: 0x9c1847,
    strokeThickness: 5,
  }),
};

function getText1(timeDelta) {
  if (
    -TIMING_WINDOW.PERFECT <= timeDelta &&
    timeDelta <= TIMING_WINDOW.PERFECT
  ) {
    return new PIXI.Text("PERFECT", styles.perfect);
  } else if (
    -TIMING_WINDOW.GREAT <= timeDelta &&
    timeDelta <= TIMING_WINDOW.GREAT
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
    this.age = 0;
    this.lifespan = 800;

    const x = JUDGEMENT_LINE_X;
    const y = lane === TOP ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;

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
    this.container.y = y - 100;
    this.container.addChild(this.text1);
    this.container.addChild(this.text2);

    container.addChild(this.container);
  }
  update = () => {
    this.age += ticker.deltaMS;
    const progress = this.age / this.lifespan;
    if (progress > 1) {
      return;
    }
    if (progress < 0.2) {
      this.container.y = this.y - 100 - progress * 250;
      this.container.scale.set(0.4 + progress * 4);
    } else if (progress < 0.6) {
      this.container.scale.x = 1;
      this.container.scale.y = 1;
    } else {
      this.container.y = this.y - 150 - (progress - 0.5) * 30;
      this.container.alpha = Math.min(5 - 5 * progress, 1);
    }
  };
  destroy() {
    this.text1.destroy();
    this.text2.destroy();
    this.container.destroy();
  }
}

function add(lane, timeDelta) {
  const judgement = new Judgement(lane, timeDelta);
  ticker.add(judgement.update);
  judgements.push(judgement);
}
ticker.add(function () {
  let index = judgements.findIndex(
    (judgement) => judgement.age > judgement.lifespan
  );
  while (index !== -1) {
    judgements[index].destroy();
    judgements.splice(index, 1);
    index = judgements.findIndex(
      (judgement) => judgement.age > judgement.lifespan
    );
  }
});
const judgement = {
  container,
  add,
};
export default judgement;
export { TIMING_WINDOW };
