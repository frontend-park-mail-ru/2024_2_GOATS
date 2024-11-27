import { Season } from './movie';

export type VideoControls = {
  video: HTMLVideoElement;
  videoWrapper: HTMLElement;
  playOrPause?: HTMLElement;
  duration: HTMLElement;
  currentTime: HTMLElement;
  progressBar: HTMLElement;
  volume: HTMLInputElement;
  isVolumeOpened: boolean;
  fullOrSmallScreen: HTMLElement;
  volumeOffOrUp: HTMLElement;
  seriesBlock: HTMLElement;
  isFullScreen: boolean;
  rewindBackButton?: HTMLElement;
  rewindFrontButton?: HTMLElement;
  videoControls: HTMLElement;
  videoMobileControls?: HTMLElement;
  videoBackButton: HTMLElement;
  videoTitle: HTMLElement;
  nextSeriesButton?: HTMLElement;
  prevSeriesButton?: HTMLElement;
  videoPlaceholder: HTMLElement;
  seasons?: Season[];
};
