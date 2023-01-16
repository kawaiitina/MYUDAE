import * as PIXI from "pixi.js";
import bar_red from "../assets/sprite/bar_red.png";
import bar_gray from "../assets/sprite/bar_gray.png";

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

const container = new PIXI.Container();

function getBarX(barTime, elapsedTime, noteSpeed) {
  return 400 + 1.5 * (barTime - elapsedTime) * noteSpeed;
}

function update(bars, noteSpeed, elapsedTime) {
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

const note = { container, update };
export default note;
