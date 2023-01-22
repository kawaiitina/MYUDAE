import { ticker } from "./pixi.js";

function finiteAnimate(container, animate, restore, lifespan) {
  let age = 0;
  function callback() {
    age += ticker.deltaMS;
    const progress = age / lifespan;
    animate(container, progress);
    if (age > lifespan) {
      restore(container);
      ticker.remove(callback);
    }
  }
  ticker.add(callback);
}
function infiniteAnimate(container, animate, interval) {
  let age = 0;
  function callback() {
    age += ticker.deltaMS;
    const progress = (age % interval) / interval;
    animate(container, progress);
  }
  ticker.add(callback);
}

function comboAdd(container) {
  function animate(container, progress) {
    container.scale.set(1 + progress / 2.5);
  }
  function restore(container) {
    container.scale.set(1);
  }
  const lifespan = 100;
  finiteAnimate(container, animate, restore, lifespan);
}
function comboReset(container) {
  function animate(container, progress) {
    container.scale.set(1 - progress / 2.5);
  }
  function restore(container) {
    container.scale.set(1);
  }
  const lifespan = 100;
  finiteAnimate(container, animate, restore, lifespan);
}
function comboBuoy(container) {
  function animate(container, progress) {
    container.y =
      container.pivot.y + 200 + 10 * Math.sin(progress * Math.PI * 2);
  }
  const interval = 6000;
  infiniteAnimate(container, animate, interval);
}

function example(container) {
  function animate(container, progress) {}
  function restore(container) {}
  const lifespan = 0;
}

const animate = { comboAdd, comboReset, comboBuoy };
export default animate;
