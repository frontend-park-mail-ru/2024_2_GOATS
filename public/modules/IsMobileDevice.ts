export const isMobileDevice = () => {
  return window.matchMedia('only screen and (max-width: 750px)').matches;
};

export const isTabletOrMobileLandscape = () => {
  return window.matchMedia('only screen and (max-width: 1050px)').matches;
};
