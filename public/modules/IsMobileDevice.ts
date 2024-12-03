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
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};
