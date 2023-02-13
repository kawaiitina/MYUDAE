import * as PIXI from "pixi.js";
import { APP_WIDTH, APP_HEIGHT } from "./const.js";

const container = new PIXI.Container();

const style = new PIXI.TextStyle({
  fontSize: 36,
  fill: 0xffffff,
});
const playbackRate = new PIXI.Text("재생 속도: 100%", style);
playbackRate.anchor.set(1, 1);
playbackRate.x = APP_WIDTH - 10;
playbackRate.y = APP_HEIGHT - 10;

const title = new PIXI.Text("", style);
title.anchor.set(0, 1);
title.x = 10;
title.y = APP_HEIGHT - 10;

container.addChild(playbackRate, title);

function changePlaybackRate(value) {
  playbackRate.text = "재생 속도: " + value.toFixed() + "%";
}
function changeScore(score) {
  if (!score) {
    title.text = "";
  } else {
    title.text = score.title + " - " + score.artist;
  }
}

const uiText = {
  container,
  changePlaybackRate,
  changeScore,
};

export default uiText;
