import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import { hslToRgb } from "./color.js";

const container = new PIXI.Container();
let effects = [];

class NotePopTop {
  constructor() {
    this.birth = performance.now();
    this.lifespan = 200;
    this.isAlive = true;

    const x = 400;
    const y = 380;
    const r = 160;

    this.container = new PIXI.Container();
    this.arcGraphics = new PIXI.Graphics();
    this.arcFilter = new PIXI.filters.BlurFilter();
    this.arcGraphics.lineStyle(5, 0xffffff);
    this.arcGraphics.arc(x, y, r, 0, 2 * Math.PI);
    this.arcGraphics.closePath();
    this.arcGraphics.lineStyle(0);
    this.arcGraphics.beginFill(0x4cbcfc);
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
    this.shadowGraphics.beginFill(0x4cbcfc);
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
  update(now) {
    const elapsedTime = now - this.birth;
    const progress = elapsedTime / this.lifespan;
    if (elapsedTime > this.lifespan) {
      this.isAlive = false;
      return;
    }

    this.container.scale.x = -(progress ** 2) + 2 * progress;
    this.container.scale.y = -(progress ** 2) + 2 * progress;
    this.container.alpha = Math.min((1 - progress) * 2, 1);
  }
  destroy() {
    this.container.destroy();
    this.arcGraphics.destroy();
    this.arcFilter.destroy();
    this.shadowGraphics.destroy();
    this.shadowFilter.destroy();
  }
}

class NotePopBottom {
  constructor() {
    this.birth = performance.now();
    this.lifespan = 200;
    this.isAlive = true;

    const x = 400;
    const y = 680;
    const r = 160;

    this.container = new PIXI.Container();
    this.arcGraphics = new PIXI.Graphics();
    this.arcFilter = new PIXI.filters.BlurFilter();
    this.arcGraphics.lineStyle(5, 0xffffff);
    this.arcGraphics.arc(x, y, r, 0, 2 * Math.PI);
    this.arcGraphics.closePath();
    this.arcGraphics.lineStyle(0);
    this.arcGraphics.beginFill(0xf85bfe);
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
    this.shadowGraphics.beginFill(0xf85bfe);
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
  update(now) {
    const elapsedTime = now - this.birth;
    const progress = elapsedTime / this.lifespan;
    if (elapsedTime > this.lifespan) {
      this.isAlive = false;
      return;
    }

    this.container.scale.x = -(progress ** 2) + 2 * progress;
    this.container.scale.y = -(progress ** 2) + 2 * progress;
    this.container.alpha = Math.min((1 - progress) * 2, 1);
    this.arcFilter.blur = 2 + progress * 4;
  }
  destroy() {
    this.container.destroy();
    this.arcGraphics.destroy();
    this.arcFilter.destroy();
    this.shadowGraphics.destroy();
    this.shadowFilter.destroy();
  }
}

class Scatter {
  constructor(y) {
    this.birth = performance.now();
    this.lifespan = 1000;
    this.isAlive = true;

    const starCount = Math.floor(6 + Math.random() * 5);

    this.container = new PIXI.Container();
    this.stars = [];

    for (let i = 0; i < starCount; i++) {
      const graphics = new PIXI.Graphics();

      const outerRadius = 30 + Math.random() * 10;
      const innerRadius = outerRadius * 0.6;
      const x = 400;
      const vx = -0.5 + Math.random() * 2;
      const vy = -1.5 * Math.random();
      const omega = 0.01 * (Math.random() - 0.5);

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
      // this.graphics.drawStar(400, y, 5, outerRadius, innerRadius);
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
  update(now) {
    const elapsedTime = now - this.birth;
    const progress = elapsedTime / this.lifespan;
    if (elapsedTime > this.lifespan) {
      this.isAlive = false;
      return;
    }
    const g = 0.003;

    this.stars.forEach((star) => {
      const x = star.vx * (progress * 1000);
      const y = star.vy * (progress * 1000) + (g * (progress * 1000) ** 2) / 2;
      star.graphics.x = star.graphics.pivot.x + x;
      star.graphics.y = star.graphics.pivot.y + y;
      star.graphics.rotation = star.omega * (progress * 1000);
      star.graphics.scale.set(1 - progress, 1 - progress);
    });
  }
  destroy() {
    this.container.destroy();
    this.stars.forEach((star) => star.graphics.destroy());
  }
}

function update(now) {
  effects.forEach((effect) => {
    effect.update(now);
    if (!effect.isAlive) {
      effect.destroy();
    }
  });
  effects = effects.filter((effect) => effect.isAlive);
}

function notePopTop() {
  effects.push(new NotePopTop());
}
function notePopBottom() {
  effects.push(new NotePopBottom());
}
function scatter(y) {
  effects.push(new Scatter(y));
}
const effect = {
  container,
  update,
  notePopTop,
  notePopBottom,
  scatter,
};
export default effect;
