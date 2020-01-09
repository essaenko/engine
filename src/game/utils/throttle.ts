export function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;
  
  function wrapper(...args) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      
      return;
    }
    func.apply(this, args);
    isThrottled = true;
    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}