export const throttle = (fn: Function, ms: number): Function => {
  let isThrottled: boolean = false;
  let savedArgs: any[];
  let savedThis: any;

  function wait(this: any, ...args: any[]) {
    if (isThrottled) {
      savedArgs = Array.from(arguments);
      savedThis = this;
      return;
    }

    fn.apply(this, arguments);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      wait.apply(savedThis, savedArgs);
      savedArgs = [];
      savedThis = null;
    }, ms);
  }

  return wait;
};
