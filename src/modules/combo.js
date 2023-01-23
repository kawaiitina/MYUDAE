import * as PIXI from "pixi.js";
import animate from "./animate.js";

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
  container.y = container.pivot.y + 150;
  container.addChild(comboText, comboUnit);
});
let currentCombo = 0;

function init() {}

function stop() {}
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

comboBuoyAnimation(container);

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
function comboBuoyAnimation(container) {
  animate.repeat(
    container,
    function (container, progress) {
      container.y =
        container.pivot.y + 150 + 10 * Math.sin(progress * Math.PI * 2);
    },
    6000
  );
}

const combo = { container, init, stop, add, reset };
export default combo;
