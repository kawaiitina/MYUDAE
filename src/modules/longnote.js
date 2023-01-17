import * as PIXI from "pixi.js";
import sound from "./sound.js";
import effect from "./effect.js";
import judgementText from "./judgement text.js";
import longnote_blue from "../assets/sprite/longnote_blue.png";
import staff_blue from "../assets/sprite/staff_blue.png";
import longnote_pink from "../assets/sprite/longnote_pink.png";
import staff_pink from "../assets/sprite/staff_pink.png";

const sprites = {
  blueStar1: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_blue);
      sprite.y = 380;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  blueStar2: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_blue);
      sprite.y = 380;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  blueStaff: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(staff_blue);
      sprite.y = 380;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pinkStar1: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_pink);
      sprite.y = 680;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pinkStar2: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_pink);
      sprite.y = 680;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pinkStaff: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(staff_pink);
      sprite.y = 680;
      sprite.anchor.set(0.5);
      return sprite;
    }),
};

const container = new PIXI.Container();

function getHeadX(longNote, elapsedTime, noteSpeed) {
  if (
    !longNote.isHeld &&
    !longNote.isReleased // 다가오기 전
  ) {
    return 400 + 1.5 * (longNote.startTime - elapsedTime) * noteSpeed;
  } else if (longNote.isHeld) {
    // 누르고 있는 중
    return 400;
  } else if (longNote.isReleased) {
    // 중간에 놓침
    return (
      400 +
      1.5 *
        (longNote.startTime -
          elapsedTime +
          (longNote.releaseTime - longNote.holdStartTime)) *
        noteSpeed
    );
  }
}
function getTailX(longNote, elapsedTime, noteSpeed) {
  return 400 + 1.5 * (longNote.endTime - elapsedTime) * noteSpeed;
}
function update(longNotes, noteSpeed, elapsedTime) {
  while (elapsedTime - longNotes.top[0]?.endTime > 1000) {
    longNotes.top.shift();
  }
  autoRelease(longNotes, elapsedTime);

  sprites.blueStaff.forEach((sprite) => container.removeChild(sprite));
  sprites.blueStar1.forEach((sprite) => container.removeChild(sprite));
  sprites.blueStar2.forEach((sprite) => container.removeChild(sprite));
  longNotes.top.forEach((longNote, i) => {
    if (i >= 25) {
      return;
    }
    const headX = getHeadX(longNote, elapsedTime, noteSpeed);
    const tailX = getTailX(longNote, elapsedTime, noteSpeed);
    sprites.blueStaff[i].x = (tailX + headX) / 2;
    sprites.blueStaff[i].scale.x = (tailX - headX) / 100;
    sprites.blueStar1[i].x = headX;
    sprites.blueStar1[i].rotation = -elapsedTime / 200;
    sprites.blueStar2[i].x = tailX;
    sprites.blueStar2[i].rotation = -elapsedTime / 200;

    container.addChild(sprites.blueStaff[i]);
    container.addChild(sprites.blueStar1[i]);
    container.addChild(sprites.blueStar2[i]);
  });
  sprites.pinkStaff.forEach((sprite) => container.removeChild(sprite));
  sprites.pinkStar1.forEach((sprite) => container.removeChild(sprite));
  sprites.pinkStar2.forEach((sprite) => container.removeChild(sprite));
  longNotes.bottom.forEach((longNote, i) => {
    if (i >= 25) {
      return;
    }
    const headX = getHeadX(longNote, elapsedTime, noteSpeed);
    const tailX = getTailX(longNote, elapsedTime, noteSpeed);
    sprites.pinkStaff[i].x = (tailX + headX) / 2;
    sprites.pinkStaff[i].scale.x = (tailX - headX) / 100;
    sprites.pinkStar1[i].x = headX;
    sprites.pinkStar1[i].rotation = -elapsedTime / 200;
    sprites.pinkStar2[i].x = tailX;
    sprites.pinkStar2[i].rotation = -elapsedTime / 200;

    container.addChild(sprites.pinkStaff[i]);
    container.addChild(sprites.pinkStar1[i]);
    container.addChild(sprites.pinkStar2[i]);
  });
}

function hold(longNotes, lane, elapsedTime, code) {
  // 롱노트 처리
  const longNote = longNotes[lane].find((longNote) => {
    const timeDelta = longNote.startTime - elapsedTime;
    return (
      !longNote.isHeld &&
      !longNote.isReleased &&
      -130 <= timeDelta &&
      timeDelta <= 130
    );
  });
  if (longNote) {
    const timeDelta = elapsedTime - longNote.startTime;
    sound.play("longNote");
    if (lane === "top") {
      effect.notePopTop();
      effect.scatter(380);
      judgementText.add(380, timeDelta);
    } else if (lane === "bottom") {
      effect.notePopBottom();
      effect.scatter(680);
      judgementText.add(680, timeDelta);
    }
    longNote.isHeld = true;
    longNote.holdStartTime = elapsedTime;
    longNote.code = code;
    return true;
  }
  return false;
}
function release(longNotes, lane, elapsedTime, code) {
  // 롱노트 처리
  const index = longNotes[lane].findIndex(
    (longNote) => !longNote.isReleased && longNote.code === code
  );
  const longNote = longNotes[lane][index];
  if (!longNote) {
    return;
  }
  const timeDelta = elapsedTime - longNote.endTime;
  if (timeDelta < -130) {
    //롱노트 놓침
    longNote.isHeld = false;
    longNote.isReleased = true;
    longNote.releaseTime = elapsedTime;
  } else if (timeDelta < 0) {
    sound.play("longNote");
    if (lane === "top") {
      effect.notePopTop();
      effect.scatter(380);
      judgementText.add(380, timeDelta);
    } else if (lane === "bottom") {
      effect.notePopBottom();
      effect.scatter(680);
      judgementText.add(680, timeDelta);
    }
    longNotes[lane].splice(index, 1);
  }
}
function autoRelease(longNotes, elapsedTime) {
  // 롱노트 처리
  const indexTop = longNotes.top.findIndex(
    (longNote) => longNote.isHeld && elapsedTime >= longNote.endTime
  );
  if (indexTop !== -1) {
    sound.play("longNote");
    effect.notePopTop();
    effect.scatter(380);
    judgementText.add(380, 0);
    longNotes.top.splice(indexTop, 1);
  }

  const indexBottom = longNotes.bottom.findIndex(
    (longNote) => longNote.isHeld && elapsedTime >= longNote.endTime
  );
  if (indexBottom !== -1) {
    sound.play("longNote");
    effect.notePopBottom();
    effect.scatter(680);
    judgementText.add(680, 0);
    longNotes.bottom.splice(indexBottom, 1);
  }
}

const longNote = { container, update, hold, release, autoRelease };
export default longNote;
