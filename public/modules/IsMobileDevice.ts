export const isMobileDevice = () => {
  return window.matchMedia('only screen and (max-width: 750px)').matches;
};

export const isTabletOrMobileLandscape = () => {
  return window.matchMedia('only screen and (max-width: 1050px)').matches;
};

export const isiOS = () => {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};

export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};
