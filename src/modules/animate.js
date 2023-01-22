import { ticker } from "./pixi.js";

function once(container, animate, restore, lifespan) {
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
function repeat(container, animate, interval) {
  let age = 0;
  function callback() {
    age += ticker.deltaMS;
    const progress = (age % interval) / interval;
    animate(container, progress);
  }
  ticker.add(callback);
}

const animate = { once, repeat };
export default animate;
