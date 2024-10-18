export const throttle = (fn: Function, ms: number): Function => {
  let isThrottled: boolean = false;
  let savedArgs: any[] | null = null;
  let savedThis: any | null = null;

  function wait(this: any, ...args: any[]) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    fn.apply(this, args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wait.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wait;
};
