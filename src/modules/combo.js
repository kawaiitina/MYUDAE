import * as PIXI from "pixi.js";
import { APP_WIDTH } from "./const.js";
import animate from "./animate.js";
import { fonts } from "./pixi.js";

const comboText = new PIXI.Text(
  "0",
  new PIXI.TextStyle({
    align: "center",
    fontFamily: fonts.FredokaOne.family,
    fontSize: 100,
    fill: 0xfee933,
    stroke: 0xf901a4,
    strokeThickness: 5,
  })
);
comboText.anchor.set(0.5);

const comboUnit = new PIXI.Text(
  "COMBO",
  new PIXI.TextStyle({
    align: "center",
    fontFamily: fonts.FredokaOne.family,
    fontSize: 40,
    fill: 0xfe00fe,
    stroke: 0xffffff,
    strokeThickness: 5,
  })
);
comboUnit.anchor.set(0.5);
comboUnit.y = 70;

const container = new PIXI.Container();
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;
container.x = container.pivot.x + APP_WIDTH / 2;
container.y = container.pivot.y + 150;
container.addChild(comboText, comboUnit);
animate.repeat(
  container,
  function (container, progress) {
    container.y =
      container.pivot.y + 150 + 10 * Math.sin(progress * Math.PI * 2);
  },
  6000
);

let currentCombo = 0;

function add() {
  currentCombo += 1;
  comboText.text = currentCombo;
  comboAddAnimation(comboText);
}
function reset() {
  if (currentCombo === 0) {
    return;
  }
  currentCombo = 0;
  comboText.text = currentCombo;
  comboResetAnimation(comboText);
}

function comboAddAnimation(container) {
  animate.once(
    container,
    function (container, progress) {
      container.scale.set(1 + progress / 2.5);
    },
    function (container) {
      container.scale.set(1);
    },
    100
  );
}
function comboResetAnimation(container) {
  animate.once(
    container,
    function (container, progress) {
      container.scale.set(1 - progress / 2.5);
    },
    function (container) {
      container.scale.set(1);
    },
    100
  );
}

const combo = { container, add, reset };
export default combo;
