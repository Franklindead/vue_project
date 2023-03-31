//函数easeInOutQuad是一个缓动函数，用来计算当前时间t在总时间d内的位置，t是当前时间，b是起始位置，c是总距离，d是总时间，返回值是当前位置。
function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}
//函数requestAnimFrame是一个动画函数，用来计算当前时间t在总时间d内的位置，t是当前时间，b是起始位置，c是总距离，d是总时间，返回值是当前位置。
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback: Function) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

//函数move是一个移动函数，用来计算当前时间t在总时间d内的位置，t是当前时间，b是起始位置，c是总距离，d是总时间，返回值是当前位置。
/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 * @param {number} amount
 */
function move(amount: number): void {
  document.documentElement.scrollTop = amount;
  document.body.parentNode.scrollTop = amount;
  document.body.scrollTop = amount;
}
//用于获取页面滚动条当前的垂直位置
function position(): number {
  return (
    document.documentElement.scrollTop ||
    document.body.parentNode.scrollTop ||
    document.body.scrollTop
  );
}

/**
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */

export function scrollTo(
  to: number,
  duration: number = 500,
  callback?: Function
): void {
  const start = position();
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = function (): void {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const val = easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
    move(val);
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof callback === "function") {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}
