import * as PIXI from "pixi.js";
import FredokaOne_Regular from "../assets/font/FredokaOne-Regular.ttf";

const pixi = new PIXI.Application({
  width: 1920,
  height: 1080,
  background: 0x181818,
  backgroundAlpha: 0.9,
});
PIXI.Assets.add("FredokaOne", FredokaOne_Regular);
const ticker = new PIXI.Ticker();
ticker.start();

export default pixi;
export { ticker };
