import * as PIXI from "pixi.js";
import sound from "./sound";
import effect from "./effect";
import judgementText from "./judgement text";
import note_blue from "../assets/sprite/note_blue.png";
import note_pink from "../assets/sprite/note_pink.png";
import note_yellow from "../assets/sprite/note_yellow.png";

const sprites = {
  blue: Array(50)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(note_blue);
      sprite.y = 380;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pink: Array(50)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(note_pink);
      sprite.y = 680;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  yellowTop: Array(50)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(note_yellow);
      sprite.y = 380;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  yellowBottom: Array(50)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(note_yellow);
      sprite.y = 680;
      sprite.anchor.set(0.5);
      return sprite;
    }),
};

const container = new PIXI.Container();

function getNoteX(noteTime, elapsedTime, noteSpeed) {
  return 400 + 1.5 * (noteTime - elapsedTime) * noteSpeed;
}

function update(notes, noteSpeed, elapsedTime) {
  while (elapsedTime - notes.top[0]?.time > 1000) {
    notes.top.shift();
  }
  sprites.blue.forEach((sprite) => container.removeChild(sprite));
  sprites.yellowTop.forEach((sprite) => container.removeChild(sprite));
  notes.top.forEach((note, i) => {
    if (i >= 50) {
      return;
    }
    if (note.color === "blue") {
      sprites.blue[i].x = getNoteX(note.time, elapsedTime, noteSpeed);
      container.addChild(sprites.blue[i]);
    } else if (note.color === "yellow") {
      sprites.yellowTop[i].x = getNoteX(note.time, elapsedTime, noteSpeed);
      container.addChild(sprites.yellowTop[i]);
    }
  });

  while (elapsedTime - notes.bottom[0]?.time > 1000) {
    notes.bottom.shift();
  }
  sprites.pink.forEach((sprite) => container.removeChild(sprite));
  sprites.yellowBottom.forEach((sprite) => container.removeChild(sprite));
  notes.bottom.forEach((note, i) => {
    if (i >= 50) {
      return;
    }
    if (note.color === "pink") {
      sprites.pink[i].x = getNoteX(note.time, elapsedTime, noteSpeed);
      container.addChild(sprites.pink[i]);
    } else if (note.color === "yellow") {
      sprites.yellowBottom[i].x = getNoteX(note.time, elapsedTime, noteSpeed);
      container.addChild(sprites.yellowBottom[i]);
    }
  });
}

function hit(notes, lane, elapsedTime) {
  const index = notes[lane].findIndex((note) => {
    const timeDelta = note.time - elapsedTime;
    return -130 <= timeDelta && timeDelta <= 130;
  });
  if (index === -1) {
    return;
  }
  const timeDelta = elapsedTime - notes[lane][index].time;
  sound.play("note");
  if (lane === "top") {
    effect.notePopTop();
    effect.scatter(380);
    judgementText.add(380, timeDelta);
  } else {
    effect.notePopBottom();
    effect.scatter(680);
    judgementText.add(680, timeDelta);
  }
  notes[lane].splice(index, 1);
}

const note = { container, update, hit };
export default note;
