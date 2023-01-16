import * as PIXI from "pixi.js";

const container = new PIXI.Container();
const graphics = new PIXI.Graphics();

graphics.beginFill(0x212121);
graphics.drawRect(0, 0, 1920, 1080);
graphics.endFill();

container.addChild(graphics);
container.alpha = 0.9;

const background = {
  container,
};
export default background;
