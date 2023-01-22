import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import { hslToRgb } from "./color.js";
import {
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
} from "./judgement-line.js";
import { ticker } from "./pixi.js";

const container = new PIXI.Container();
const effects = [];

class NotePop {
  constructor(lane) {
    this.age = 0;
    this.lifespan = 200;

    const x = JUDGEMENT_LINE_X;
    const y = lane === "top" ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;
    const color = lane === "top" ? 0x4cbcfc : 0xf85bfe;
    const r = 160;

    this.container = new PIXI.Container();
    this.arcGraphics = new PIXI.Graphics();
    this.arcFilter = new PIXI.filters.BlurFilter();
    this.arcGraphics.lineStyle(5, 0xffffff);
    this.arcGraphics.arc(x, y, r, 0, 2 * Math.PI);
    this.arcGraphics.closePath();
    this.arcGraphics.lineStyle(0);
    this.arcGraphics.beginFill(color);
    this.arcGraphics.drawCircle(x, y, 0.7 * r);
    this.arcGraphics.endFill();
    this.arcGraphics.lineStyle(0);
    this.arcGraphics.beginFill(0xffffff);
    this.arcGraphics.drawCircle(x, y, 0.5 * r);
    this.arcGraphics.endFill();
    this.arcFilter.blur = 6;
    this.arcGraphics.filters = [this.arcFilter];

    this.shadowGraphics = new PIXI.Graphics();
    this.shadowFilter = new PIXI.filters.BlurFilter();
    this.shadowGraphics.lineStyle(0);
    this.shadowGraphics.beginFill(color);
    this.shadowGraphics.drawCircle(x, y, 1.2 * r);
    this.shadowGraphics.endFill();
    this.shadowGraphics.alpha = 0.5;
    this.shadowFilter.blur = 10;
    this.shadowGraphics.filters = [this.shadowFilter];

    this.container.pivot.x = x;
    this.container.pivot.y = y;
    this.container.x = x;
    this.container.y = y;
    this.container.addChild(this.shadowGraphics);
    this.container.addChild(this.arcGraphics);

    container.addChild(this.container);
  }
  update = () => {
    this.age += ticker.deltaMS;
    const progress = this.age / this.lifespan;
    if (progress > 1) {
      return;
    }
    this.container.scale.set(-(progress ** 2) + 2 * progress);
    this.container.alpha = Math.min((1 - progress) * 2, 1);
  };
  destroy() {
    this.container.destroy();
    this.arcGraphics.destroy();
    this.arcFilter.destroy();
    this.shadowGraphics.destroy();
    this.shadowFilter.destroy();
  }
}
class Scatter {
  constructor(lane) {
    this.age = 0;
    this.lifespan = 1000;

    const starCount = Math.floor(6 + Math.random() * 5);
    const y = lane === "top" ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;

    this.container = new PIXI.Container();
    this.stars = [];

    for (let i = 0; i < starCount; i++) {
      const graphics = new PIXI.Graphics();

      const outerRadius = 30 + Math.random() * 10;
      const innerRadius = outerRadius * 0.6;
      const x = JUDGEMENT_LINE_X;
      const vx = -0.5 + Math.random() * 2;
      const vy = -1.5 * Math.random();
      const omega = 0.03 * (Math.random() - 0.5);

      graphics.pivot.x = x;
      graphics.pivot.y = y;
      graphics.lineStyle(0);
      graphics.beginFill(
        hslToRgb(
          250 + Math.random() * 60,
          (60 + Math.random() * 20) / 100,
          (70 + Math.random() * 20) / 100
        )
      );
      graphics.drawStar(x, y, 5, outerRadius, innerRadius);
      graphics.endFill();
      this.container.addChild(graphics);
      this.stars.push({
        graphics,
        vx,
        vy,
        omega,
      });
    }

    container.addChild(this.container);
  }
  update = () => {
    this.age += ticker.deltaMS;
    const progress = this.age / this.lifespan;
    if (progress > 1) {
      return;
    }

    const g = 0.003;

    this.stars.forEach((star) => {
      const x = star.vx * (progress * this.lifespan);
      const y =
        star.vy * (progress * this.lifespan) +
        (g * (progress * this.lifespan) ** 2) / 2;
      star.graphics.x = star.graphics.pivot.x + x;
      star.graphics.y = star.graphics.pivot.y + y;
      star.graphics.rotation = star.omega * (progress * this.lifespan);
      star.graphics.scale.set(1 - progress, 1 - progress);
    });
  };
  destroy() {
    this.stars.forEach((star) => star.graphics.destroy());
    this.container.destroy();
  }
}

function notePop(lane) {
  const effect = new NotePop(lane);
  ticker.add(effect.update);
  effects.push(effect);
}
function scatter(lane) {
  const effect = new Scatter(lane);
  ticker.add(effect.update);
  effects.push(effect);
}

ticker.add(function () {
  let index = effects.findIndex((effect) => effect.age > effect.lifespan);
  while (index !== -1) {
    effects[index].destroy();
    effects.splice(index, 1);
    index = effects.findIndex((effect) => effect.age > effect.lifespan);
  }
});
const effect = {
  container,
  notePop,
  scatter,
};
export default effect;
