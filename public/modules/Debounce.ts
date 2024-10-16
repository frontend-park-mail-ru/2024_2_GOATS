export const debounce = (fn: Function, ms: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any) {
    const fnCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};
