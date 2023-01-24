import * as PIXI from "pixi.js";
import FredokaOne_Regular from "../assets/font/FredokaOne-Regular.ttf";
import longnote_blue from "../assets/sprite/longnote_blue.png";
import staff_blue from "../assets/sprite/staff_blue.png";
import longnote_pink from "../assets/sprite/longnote_pink.png";
import staff_pink from "../assets/sprite/staff_pink.png";
import note_blue from "../assets/sprite/note_blue.png";
import note_pink from "../assets/sprite/note_pink.png";
import note_yellow from "../assets/sprite/note_yellow.png";
import bar_red from "../assets/sprite/bar_red.png";
import bar_gray from "../assets/sprite/bar_gray.png";
import judgement_line_blue from "../assets/sprite/judgement_line_blue.png";
import judgement_line_pink from "../assets/sprite/judgement_line_pink.png";
import spinner from "../assets/sprite/spinner.png";

const pixi = new PIXI.Application({
  width: 1920,
  height: 1080,
  background: 0x181818,
  backgroundAlpha: 0.9,
});
PIXI.Assets.add("FredokaOne", FredokaOne_Regular);
const fonts = {
  FredokaOne: await PIXI.Assets.load("FredokaOne"),
};

PIXI.Assets.add("longnote_blue", longnote_blue);
PIXI.Assets.add("staff_blue", staff_blue);
PIXI.Assets.add("longnote_pink", longnote_pink);
PIXI.Assets.add("staff_pink", staff_pink);
PIXI.Assets.add("note_blue", note_blue);
PIXI.Assets.add("note_pink", note_pink);
PIXI.Assets.add("note_yellow", note_yellow);
PIXI.Assets.add("bar_red", bar_red);
PIXI.Assets.add("bar_gray", bar_gray);
PIXI.Assets.add("judgement_line_blue", judgement_line_blue);
PIXI.Assets.add("judgement_line_pink", judgement_line_pink);
PIXI.Assets.add("spinner", spinner);
const sprites = {
  longnoteBlue: await PIXI.Assets.load("longnote_blue"),
  staffBlue: await PIXI.Assets.load("staff_blue"),
  longnotePink: await PIXI.Assets.load("longnote_pink"),
  staffPink: await PIXI.Assets.load("staff_pink"),
  noteBlue: await PIXI.Assets.load("note_blue"),
  notePink: await PIXI.Assets.load("note_pink"),
  noteYellow: await PIXI.Assets.load("note_yellow"),
  barRed: await PIXI.Assets.load("bar_red"),
  barGray: await PIXI.Assets.load("bar_gray"),
  judgementLineBlue: await PIXI.Assets.load("judgement_line_blue"),
  judgementLinePink: await PIXI.Assets.load("judgement_line_pink"),
  spinner: await PIXI.Assets.load("spinner"),
};

const ticker = new PIXI.Ticker();
ticker.start();

export default pixi;
export { ticker, sprites, fonts };
