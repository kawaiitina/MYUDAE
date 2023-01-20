import * as PIXI from "pixi.js";

const container = new PIXI.Container();

const style = new PIXI.TextStyle({
  fontSize: 24,
  fill: 0xffffff,
});
const playbackRate = new PIXI.Text("재생 속도: 100%", style);
playbackRate.anchor.set(1);
playbackRate.x = 1910;
playbackRate.y = 1070;

const title = new PIXI.Text("", style);
title.anchor.set(0.5, 1);
title.x = 960;
title.y = 1070;

container.addChild(playbackRate, title);

function changePlaybackRate(value) {
  playbackRate.text = "재생 속도: " + value.toFixed() + "%";
}
function changeScore(score) {
  title.text = score.title + " - " + score.artist;
}

const uiText = {
  container,
  changePlaybackRate,
  changeScore,
};

export default uiText;
