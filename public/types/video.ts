export type VideoControls = {
  video: HTMLVideoElement;
  videoWrapper: HTMLElement;
  playOrPause: HTMLElement;
  // playbackline: HTMLElement;
  duration: HTMLElement;
  currentTime: HTMLElement;
  progressBar: HTMLElement;
  volume: HTMLInputElement;
  isVolumeOpened: boolean;
  fullOrSmallScreen: HTMLElement;
  isFullScreen: boolean;
  rewindBackButton: HTMLElement;
  rewindFrontButton: HTMLElement;
  videoControls: HTMLElement;
  videoBackButton: HTMLElement;
  nextSeriesButton: HTMLElement;
  prevSeriesButton: HTMLElement;
};
