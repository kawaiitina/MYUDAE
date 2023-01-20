import * as PIXI from "pixi.js";
import { ticker } from "./pixi.js";

const container = new PIXI.Container();
let comboText;
let comboUnit;
PIXI.Assets.load("FredokaOne").then((font) => {
  const FredokaOne = font.family;
  comboText = new PIXI.Text(
    "0",
    new PIXI.TextStyle({
      align: "center",
      fontFamily: FredokaOne,
      fontSize: 100,
      fill: 0xfee933,
      stroke: 0xf901a4,
      strokeThickness: 5,
    })
  );
  comboUnit = new PIXI.Text(
    "COMBO",
    new PIXI.TextStyle({
      align: "center",
      fontFamily: FredokaOne,
      fontSize: 40,
      fill: 0xfe00fe,
      stroke: 0xffffff,
      strokeThickness: 5,
    })
  );
  comboText.anchor.set(0.5);
  comboUnit.anchor.set(0.5);
  comboUnit.y = 70;
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;
  container.x = container.pivot.x + 960;
  container.y = container.pivot.y + 200;
  container.addChild(comboText, comboUnit);
});
let currentCombo = 0;

function stop() {
  //   currentCombo = 0;
}
function add() {
  currentCombo += 1;
  comboText.text = currentCombo;
  animate.pop();
}
function reset() {
  if (currentCombo === 0) {
    return;
  }
  currentCombo = 0;
  comboText.text = currentCombo;
  animate.shrink();
}

const animate = {
  pop() {
    let frame = 0;
    function callback() {
      frame += 1;
      comboText.scale.set(1 + frame / 15);
      if (frame > 6) {
        comboText.scale.set(1);
        ticker.remove(callback);
      }
    }
    ticker.add(callback);
  },
  shrink() {
    let frame = 0;
    function callback() {
      frame += 1;
      comboText.scale.set(1 - frame / 15);
      if (frame > 12) {
        comboText.scale.set(1);
        ticker.remove(callback);
      }
    }
    ticker.add(callback);
  },
};

const combo = { container, stop, add, reset };
export default combo;
