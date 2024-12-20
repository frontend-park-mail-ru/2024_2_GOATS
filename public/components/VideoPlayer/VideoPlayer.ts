import template from './VideoPlayer.hbs';
import { timeFormatter } from 'modules/TimeFormatter';
import { VideoControls } from 'types/video';
import {
  isiOS,
  isMobileDevice,
  isTabletOrMobileLandscape,
  isTouchDevice,
} from 'modules/IsMobileDevice';
import {
  CLOSING_SERIES_MENU_TIMEOUT,
  PLAYER_CONTROLL_HIDING_TIMEOUT,
} from '../../consts';
import { Season } from 'types/movie';
import { SeriesList } from 'components/SeriesList/SeriesList';

export class VideoPlayer {
  #parent;
  #videoUrl;
  #titleImage;
  #isPlaying;
  #controls!: VideoControls;
  #hideControlsTimeout!: number;
  #tickInterval!: number;
  #startTimeCode;
  #onBackClick;
  #onPauseClick;
  #onPlayClick;
  #handleRewindVideo;
  #isDragging = false;
  #isModal;
  #hanldeIntervalTick;
  #onVideoUpdate;
  #handleSaveTimecode;
  #boundHandleKeyPress;
  #currentSeries;
  #currentSeason;
  #nextOrPrevClicked;
  #playClicked;
  #seasons;
  #seriesPosition: number | null = null;
  #seriesBlockTimeout!: number;
  #isSeriesBlockVisible: boolean;
  #autoplay!: boolean;
  #onSeriesClick;
  #areControlsVisible: boolean;
  #wasRewindByOthers: boolean;
  #wasPlayOrPauseByOthers: boolean;
  #isSeeking = false;
  #seekTimeout: any;
  #fromRoomPage;
  #fromIosPlayer;

  constructor(params: {
    parent: HTMLElement;
    videoUrl: string;
    titleImage?: string;
    startTimeCode?: number;
    currentSeries?: number;
    currentSeason?: number;
    seasons?: Season[];
    autoPlay?: boolean;
    fromRoomPage?: boolean;
    onBackClick?: () => void;
    onPlayClick?: (timeCode: number) => void;
    onPauseClick?: (timeCode: number) => void;
    handleRewindVideo?: (timeCode: number) => void;
    hanldeIntervalTick?: (timeCode: number) => void;
    onVideoUpdate?: (
      videoUrl: string,
      currentSeason: number,
      currentSeries: number,
      fromIos?: boolean,
    ) => void;
    handleSaveTimecode?: (
      timeCode: number,
      duration: number,
      season?: number,
      series?: number,
    ) => void;
    onSeriesClick?: () => void;
  }) {
    this.#parent = params.parent;
    this.#videoUrl = params.videoUrl;
    this.#titleImage = params.titleImage;
    this.#isPlaying = false;
    this.#startTimeCode = params.startTimeCode;
    this.#currentSeries = params.currentSeries;
    this.#currentSeason = params.currentSeason;
    this.#seasons = params.seasons;
    this.#onBackClick = params.onBackClick;
    this.#onPlayClick = params.onPlayClick;
    this.#onPauseClick = params.onPauseClick;
    this.#handleRewindVideo = params.handleRewindVideo;
    this.#hanldeIntervalTick = params.hanldeIntervalTick;
    this.#isModal = params.onBackClick ? true : false;
    this.#onVideoUpdate = params.onVideoUpdate;
    this.#handleSaveTimecode = params.handleSaveTimecode;
    this.#boundHandleKeyPress = this.handleKeyPress.bind(this);
    this.#nextOrPrevClicked = false;
    this.#playClicked = false;
    this.#isSeriesBlockVisible = false;
    this.#autoplay = !!params.autoPlay;
    this.#onSeriesClick = params.onSeriesClick;
    this.#areControlsVisible = true;
    this.#wasRewindByOthers = false;
    this.#wasPlayOrPauseByOthers = false;
    this.#seekTimeout = null;
    this.#fromRoomPage = !!params.fromRoomPage;
    this.#fromIosPlayer = false;

    this.checkSeriesPosition();

    if (params.seasons) {
    }
  }

  render() {
    this.renderTemplate();
    this.initControls();
    this.addEventListeners();

    if (this.#startTimeCode) {
      this.#controls.video.currentTime = this.#startTimeCode;
    } else {
      this.#controls.video.currentTime = 0;
      const slider = document.getElementById(
        'progress-slider',
      ) as HTMLInputElement;
      slider.style.setProperty('--progress-value', `0%`);
    }
  }

  renderTemplate() {
    const isPlaying = this.#isPlaying;

    let allSeriesCount = 0;
    if (this.#seasons) {
      this.#seasons.forEach((season) => {
        season.episodes.forEach(() => {
          allSeriesCount++;
        });
      });
    }

    let hasNextSeries = false;
    let hasPrevSeries = false;

    if (this.#seriesPosition) {
      hasNextSeries = !!(
        this.#seasons && this.#seriesPosition < allSeriesCount
      );

      hasPrevSeries = !!(this.#seasons && this.#seriesPosition > 1);
    }

    this.#parent.innerHTML = template({
      videoUrl: this.#videoUrl,
      titleImage: this.#titleImage,
      currentSeason: this.#currentSeason,
      currentSeries: this.#currentSeries,
      isPlaying,
      isSerial: this.#seasons,
      isModal: this.#isModal,
      hasNextSeries: hasNextSeries,
      hasPrevSeries: hasPrevSeries,
    });

    const root = document.getElementById('root') as HTMLElement;
    if (this.#isModal) {
      root.classList.add('lock');
    }

    if (this.#seasons) {
      this.renderSeriesList();
    }
  }

  // Инициализация всех элементов управления
  initControls() {
    this.#controls = {
      video: document.getElementById('video') as HTMLVideoElement,
      videoWrapper: document.querySelector('.video__wrapper') as HTMLElement,
      duration: document.getElementById('duration') as HTMLElement,
      currentTime: document.getElementById('current-time') as HTMLElement,
      progressBar: document.querySelector(
        '.video__progress_bar',
      ) as HTMLElement,
      volume: document.getElementById('volume-input') as HTMLInputElement,
      isVolumeOpened: false,
      fullOrSmallScreen: document.getElementById('full-small') as HTMLElement,
      volumeOffOrUp: document.getElementById('volume-off-up') as HTMLElement,
      isFullScreen: false,
      videoBackButton: document.getElementById(
        'video-back-button',
      ) as HTMLElement,
      videoTitle: document.querySelector('.video__title') as HTMLElement,
      videoControls: document.getElementById('video-controls') as HTMLElement,
      videoPlaceholder: document.getElementById(
        'video-placeholder',
      ) as HTMLElement,
    };

    if (this.#seasons) {
      this.#controls = {
        ...this.#controls,
        seriesBlock: document.getElementById('series-block') as HTMLElement,
        seriesButton: document.getElementById('seasons-button') as HTMLElement,
      };
    }

    if (!isTabletOrMobileLandscape()) {
      this.#controls = {
        ...this.#controls,
        playOrPause: document.getElementById('play-pause') as HTMLElement,
        rewindBackButton: document.getElementById(
          'rewind-back-button',
        ) as HTMLElement,
        rewindFrontButton: document.getElementById(
          'rewind-front-button',
        ) as HTMLElement,
        nextSeriesButton: document.getElementById(
          'next-series-button',
        ) as HTMLElement,
        prevSeriesButton: document.getElementById(
          'prev-series-button',
        ) as HTMLElement,
      };
    } else {
      this.#controls = {
        ...this.#controls,
        playOrPause: document.getElementById(
          'play-pause-mobile',
        ) as HTMLElement,
        rewindBackButton: document.getElementById(
          'rewind-back-button-mobile',
        ) as HTMLElement,
        rewindFrontButton: document.getElementById(
          'rewind-front-button-mobile',
        ) as HTMLElement,
        nextSeriesButton: document.getElementById(
          'next-series-button-mobile',
        ) as HTMLElement,
        prevSeriesButton: document.getElementById(
          'prev-series-button-mobile',
        ) as HTMLElement,
        videoMobileControls: document.getElementById(
          'video-mobile-controls',
        ) as HTMLElement,
      };
    }

    if (isMobileDevice() && this.#seasons) {
      const timeBlock = document.querySelector(
        '.video__controls_actions_left_time',
      ) as HTMLElement;
      const timeBlockMobile = document.querySelector(
        '.video-mobile__controls_timer',
      ) as HTMLElement;

      timeBlock.style.display = 'none';
      timeBlockMobile.style.display = 'block';

      this.#controls = {
        ...this.#controls,
        currentTimeMobile: document.getElementById(
          'current-time-mobile',
        ) as HTMLElement,
        duration: document.getElementById('duration-mobile') as HTMLElement,
      };
    }

    this.#controls.volume.style.setProperty('--progress-volume-value', '100%');

    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    slider.style.setProperty('--progress-value', `0%`);
  }

  // Добавляем все события
  addEventListeners() {
    const {
      video,
      fullOrSmallScreen,
      volume,
      volumeOffOrUp,
      seriesBlock,
      seriesButton,
      isFullScreen,
    } = this.#controls;

    video.addEventListener('canplay', this.updateDuration.bind(this));
    video.addEventListener('play', this.onPlay.bind(this));
    video.addEventListener('pause', this.onPause.bind(this));
    video.addEventListener('timeupdate', () => {
      !this.#nextOrPrevClicked && this.updateProgress.bind(this)();
    });
    video.addEventListener('ended', this.onVideoEnd.bind(this));

    // TODO: проверить на мобилке
    // if (this.#isModal) {
    video.addEventListener('loadeddata', this.hidePlaceholder.bind(this));
    // }

    fullOrSmallScreen.addEventListener(
      'click',
      this.toggleFullScreen.bind(this),
    );

    volumeOffOrUp.addEventListener('click', this.setVolume.bind(this));

    volume.addEventListener('input', this.updateVolumeByClick.bind(this));

    document.addEventListener(
      'fullscreenchange',
      this.checkScreenButton.bind(this),
    );

    if (this.#isModal) {
      this.handleBackButtonClick();
    }

    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    slider.disabled = true;

    slider.addEventListener('mousedown', this.onSliderMouseDown.bind(this));
    slider.addEventListener('mouseup', this.onSliderMouseUp.bind(this));
    slider.addEventListener('touchstart', this.onSliderMouseDown.bind(this));
    slider.addEventListener('touchend', this.onSliderMouseUp.bind(this));
    slider.addEventListener('touchcancel', this.onSliderMouseUp.bind(this));

    if (this.#seasons) {
      if (!isTouchDevice()) {
        seriesButton?.addEventListener(
          'mouseenter',
          this.seriesHandleMouseEnter.bind(this),
        );

        seriesBlock?.addEventListener(
          'mouseleave',
          this.seriesHandleMouseLeave.bind(this),
        );
        seriesBlock?.addEventListener(
          'mouseenter',
          this.clearSeriesBlockTimeout.bind(this),
        );
      } else {
        seriesButton?.addEventListener('click', () => {
          this.onSeriesButtonClick();
        });
      }
    }

    //TODO: проверить
    if (isTouchDevice()) {
      volume.style.display = 'none';
    }

    video.addEventListener(
      'webkitendfullscreen',
      this.handleIOSFullscreenEnd.bind(this),
    );

    video.addEventListener(
      'webkitbeginfullscreen',
      this.handleIOSFullscreenIn.bind(this),
    );

    if (isiOS()) {
      volume.style.display = 'none';
    }

    if (this.#autoplay || isiOS()) {
      video.autoplay = true;
    }

    // TODO: проверить на мобилке
    if (!this.#isModal) {
      // this.hidePlaceholder();

      if (isTouchDevice() && isTabletOrMobileLandscape()) {
        const controls = document.querySelector(
          '.video__controls',
        ) as HTMLElement;
        controls.style.padding = '10px';
        controls.style.gap = '0';
      }
    } else {
      video.autoplay = true;
    }

    if (isiOS()) {
      if (isiOS()) {
        video.addEventListener('seeking', this.handleSeekingIOS.bind(this));
        video.addEventListener('seeked', this.handleSeekedIOS.bind(this));
      }
    }
  }

  addControlsListeners() {
    const {
      video,
      playOrPause,
      rewindBackButton,
      rewindFrontButton,
      nextSeriesButton,
      prevSeriesButton,
    } = this.#controls;

    playOrPause?.addEventListener('click', this.togglePlayback.bind(this));

    if (!isTabletOrMobileLandscape()) {
      video.addEventListener('click', this.togglePlayback.bind(this));
    } else {
      video.addEventListener('click', () => {
        if (this.#areControlsVisible) {
          this.addHidden();
        } else {
          this.removeHidden();

          if (!video.paused) {
            this.resetHideControlsTimer();
          }
        }
        this.#areControlsVisible = !this.#areControlsVisible;
      });
    }

    rewindBackButton?.addEventListener('click', this.rewindBack.bind(this));
    rewindFrontButton?.addEventListener('click', this.rewindFront.bind(this));

    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    slider.disabled = false;
    slider.addEventListener('input', this.updateSliderByInput.bind(this));

    slider.addEventListener('change', this.setVideoTimeBySlider.bind(this));

    if (nextSeriesButton) {
      nextSeriesButton.addEventListener('click', () => {
        if (this.#onSeriesClick) {
          this.#onSeriesClick();
        }
        this.onNextSeriesClick();
        this.#nextOrPrevClicked = true;
      });
    }

    if (prevSeriesButton) {
      if (this.#onSeriesClick) {
        this.#onSeriesClick();
      }
      prevSeriesButton.addEventListener('click', () => {
        this.onPrevSeriesClick();
        this.#nextOrPrevClicked = true;
      });
    }

    // Проверка, чтобы управлять клавишами нельзя было на странице комнаты без полноэкранного режима
    if (!this.#fromRoomPage) {
      document.addEventListener('keydown', this.#boundHandleKeyPress);
    }

    window.addEventListener('beforeunload', () => {
      if (this.#handleSaveTimecode && !this.#seasons) {
        this.#handleSaveTimecode(video.currentTime, video.duration);
      } else if (this.#handleSaveTimecode) {
        this.#handleSaveTimecode(
          video.currentTime,
          video.duration,
          this.#currentSeason,
          this.#currentSeries,
        );
      }
    });
  }

  // Вспомогательные функции для использования снаружи
  getCurrentVideoTime() {
    const { video } = this.#controls;
    return video.currentTime;
  }

  getVideoDuration() {
    const { video } = this.#controls;
    return video.duration;
  }

  setVideoTime(timeCode: number) {
    const { video } = this.#controls;
    video.currentTime = timeCode;
  }

  videoPlay() {
    const { video } = this.#controls;
    video.play();
    this.resetHideControlsTimer();
    this.#wasPlayOrPauseByOthers = true;
  }

  videoPause(timeCode: number) {
    const { video } = this.#controls;
    video.pause();
    video.currentTime = timeCode;
    clearInterval(this.#tickInterval);
    this.resetHideControlsTimer();
    this.#wasPlayOrPauseByOthers = true;
  }

  videoRewind(timeCode: number) {
    const { video } = this.#controls;
    video.currentTime = timeCode;
    this.#wasRewindByOthers = true;
  }

  // Обработчики событий
  onSliderMouseDown() {
    this.#isDragging = true;
  }

  onSliderMouseUp() {
    this.#isDragging = false;
  }

  updateProgress() {
    const { video } = this.#controls;

    if (this.#controls.currentTimeMobile) {
      this.#controls.currentTimeMobile.textContent = timeFormatter(
        video.currentTime,
      );
    } else {
      this.#controls.currentTime.textContent = timeFormatter(video.currentTime);
    }

    if (this.#isDragging) return;

    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;

    const percentage = ((video.currentTime / video.duration) * 100).toFixed(3);

    if (slider) {
      if (Number(percentage) <= 40) {
        slider.style.setProperty(
          '--progress-value',
          `calc(${percentage}% + 5px)`,
        );
      } else {
        slider.style.setProperty('--progress-value', `${percentage}%`);
      }

      slider.value = percentage.toString();
    }
  }

  updateSliderByInput() {
    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    const percentage = slider.value;

    this.resetHideControlsTimer();
    slider.style.setProperty('--progress-value', `${Number(percentage)}%`);
  }

  setVideoTimeBySlider() {
    const { video } = this.#controls;
    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;

    const newTime = (Number(slider.value) / 100) * video.duration;

    if (this.#handleRewindVideo) {
      this.#handleRewindVideo(newTime);
    }
    video.currentTime = newTime;

    this.updateProgress();
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.togglePlayback();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.rewindBack();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.rewindFront();
    }
  }

  // Обработчики событий в отдельных методах
  updateDuration() {
    const { video, duration } = this.#controls;
    duration.textContent = timeFormatter(video.duration);
  }

  onPlay() {
    const { video } = this.#controls;
    this.handlePlayOrPauseIOS();

    // if (isiOS()) {
    //   if (this.#onPlayClick) {
    //     if (!this.#playClicked) this.#onPlayClick(video.currentTime);
    //   }
    // }

    video.setAttribute('playsinline', '');
    const { playOrPause } = this.#controls;
    playOrPause?.classList.add('video__controls_icon_pause');
    playOrPause?.classList.remove('video__controls_icon_play');
    video.setAttribute('playsinline', '');
  }

  onPause() {
    const { video } = this.#controls;
    this.handlePlayOrPauseIOS();

    video.setAttribute('playsinline', '');
    clearTimeout(this.#hideControlsTimeout);
    const { playOrPause } = this.#controls;
    playOrPause?.classList.add('video__controls_icon_play');
    playOrPause?.classList.remove('video__controls_icon_pause');
  }

  onVideoEnd() {
    const { video, playOrPause } = this.#controls;
    video.pause();
    playOrPause?.classList.remove('paused');
  }

  togglePlayback() {
    const { video } = this.#controls;
    this.resetHideControlsTimer();
    if (video.paused) {
      this.#playClicked = true;
      video.play();
      video.setAttribute('playsinline', '');

      if (this.#onPlayClick) {
        this.#onPlayClick(this.#controls.video.currentTime);
      }
      this.#playClicked = false;
      this.onPlay();
    } else {
      video.pause();
      if (this.#onPauseClick) {
        this.#onPauseClick(this.#controls.video.currentTime);
      }
      this.onPause();
    }

    // TODO: проверить autoplay на мобилке
    // video.setAttribute('playsinline', '');

    // if (this.#onPlayClick) {
    //   this.#onPlayClick(this.#controls.video.currentTime);
    // }
    // const { playOrPause } = this.#controls;
    // playOrPause?.classList.add('video__controls_icon_pause');
    // playOrPause?.classList.remove('video__controls_icon_play');
    // video.setAttribute('playsinline', '');

    this.#isPlaying = !this.#isPlaying;
  }

  toggleFullScreen() {
    const { videoWrapper, isFullScreen, video } = this.#controls;

    if (isFullScreen) {
      document.exitFullscreen();
      this.#controls.isFullScreen = false;
      this.#controls.fullOrSmallScreen.classList.add(
        'video__controls_icon_full',
      );
      this.#controls.fullOrSmallScreen.classList.remove(
        'video__controls_icon_small',
      );

      video.removeAttribute('controls');
      video.setAttribute('playsinline', '');
      this.resetHideControlsTimer();
    } else {
      video.removeAttribute('playsinline');
      if (videoWrapper.requestFullscreen) {
        videoWrapper.requestFullscreen();
      } else {
        (video as any).webkitEnterFullScreen();
      }

      this.#controls.isFullScreen = true;
      this.#controls.fullOrSmallScreen.classList.add(
        'video__controls_icon_small',
      );
      this.#controls.fullOrSmallScreen.classList.remove(
        'video__controls_icon_full',
      );
    }
  }

  checkScreenButton() {
    const { isFullScreen } = this.#controls;
    if (document.fullscreenElement === null && isFullScreen) {
      this.#controls.isFullScreen = false;
      this.#controls.fullOrSmallScreen.classList.add(
        'video__controls_icon_full',
      );
      this.#controls.fullOrSmallScreen.classList.remove(
        'video__controls_icon_small',
      );
    }

    // TODO: ПРОТЕСТИРОВАТЬ!!!
    if (this.#fromRoomPage && isFullScreen && !isMobileDevice()) {
      document.addEventListener('keydown', this.#boundHandleKeyPress);
    } else if (this.#fromRoomPage) {
      document.removeEventListener('keydown', this.#boundHandleKeyPress);
    }
  }

  volumeCheck() {
    const { volume, volumeOffOrUp, video } = this.#controls;
    if (video.muted || volume.value === '0') {
      volumeOffOrUp.classList.remove('video__controls_icon_volume-up');
      volumeOffOrUp.classList.add('video__controls_icon_volume-off');
    } else if (
      !Array.from(volumeOffOrUp.classList).includes(
        'video__controls_icon_volume-up',
      )
    ) {
      volumeOffOrUp.classList.remove('video__controls_icon_volume-off');
      volumeOffOrUp.classList.add('video__controls_icon_volume-up');
    }
  }

  updateVolumeByClick() {
    this.resetHideControlsTimer();
    const { volume, video } = this.#controls;
    const percentage = Number(volume.value) * 100;
    volume.style.setProperty('--progress-volume-value', `${percentage}%`);
    video.volume = Number(volume.value);

    if (Number(volume.value) > 0 && video.muted) {
      video.muted = false;
    }

    this.volumeCheck();
  }

  setVolume() {
    const { video, volume } = this.#controls;

    if (video.muted) {
      video.muted = false;
      volume.value = '1';
      volume.style.setProperty('--progress-volume-value', `100%`);
    } else {
      video.muted = true;
      volume.value = '0';
      volume.style.setProperty('--progress-volume-value', `0%`);
    }

    this.volumeCheck();
  }

  rewindBack() {
    const { video } = this.#controls;
    if (this.#handleRewindVideo) {
      this.#handleRewindVideo(video.currentTime - 15);
    }
    video.currentTime -= 15;
    this.updateProgress();
  }

  rewindFront() {
    const { video } = this.#controls;
    if (this.#handleRewindVideo) {
      this.#handleRewindVideo(video.currentTime + 15);
    }
    video.currentTime += 15;
    this.updateProgress();
  }

  initAutoHideControls() {
    const { videoWrapper, video } = this.#controls;

    videoWrapper.addEventListener('mousemove', () => {
      if (!video.paused && !this.#isSeriesBlockVisible) {
        this.resetHideControlsTimer.bind(this)();
      }
    });

    if (!video.paused) {
      this.resetHideControlsTimer();
    }
  }

  removeHidden() {
    this.#controls.videoControls.classList.remove('video__controls_hidden');
    this.#controls.videoWrapper.classList.remove('hidden');
    if (this.#isModal) {
      this.#controls.videoBackButton.classList.remove('video__controls_hidden');
    }
    this.#controls.videoTitle.classList.remove('video__controls_hidden');

    this.#controls.videoMobileControls?.classList.remove(
      'video__controls_hidden',
    );
  }

  addHidden() {
    this.#controls.videoControls.classList.add('video__controls_hidden');
    if (this.#controls.videoBackButton) {
      this.#controls.videoBackButton.classList.add('video__controls_hidden');
    }
    this.#controls.videoTitle.classList.add('video__controls_hidden');
    this.#controls.videoWrapper.classList.add('hidden');

    // if (this.#isModal) {
    this.#controls.videoMobileControls?.classList.add('video__controls_hidden');
    // }
  }

  // Показываем и скрываем плеер по таймеру
  resetHideControlsTimer() {
    clearTimeout(this.#hideControlsTimeout);
    this.removeHidden();

    this.#hideControlsTimeout = window.setTimeout(() => {
      this.#areControlsVisible = false;
      this.addHidden();
      this.#controls.videoWrapper.style.zIndex = '1000';
    }, PLAYER_CONTROLL_HIDING_TIMEOUT);
  }

  // Для выполнения функции каждые 3 секунды во время проигрывания видео
  intervalTick() {
    clearInterval(this.#tickInterval);

    this.#tickInterval = window.setInterval(() => {
      if (this.#hanldeIntervalTick) {
        this.#hanldeIntervalTick(this.#controls.video.currentTime);
      }
    }, 1000);
  }

  handleBackButtonClick() {
    const { video } = this.#controls;

    this.#controls.videoBackButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.#onBackClick) {
        this.#onBackClick();
        if (this.#handleSaveTimecode && !this.#seasons) {
          this.#handleSaveTimecode(video.currentTime, video.duration);
        } else if (this.#handleSaveTimecode) {
          this.#handleSaveTimecode(
            video.currentTime,
            video.duration,
            this.#currentSeason,
            this.#currentSeries,
          );
        }

        document.removeEventListener('keydown', this.#boundHandleKeyPress);
      }
      const root = document.getElementById('root') as HTMLElement;
      root.classList.remove('lock');
    });
  }

  hidePlaceholder() {
    const { videoPlaceholder, video } = this.#controls;
    videoPlaceholder.style.display = 'none';

    this.addControlsListeners();

    this.initAutoHideControls();
  }

  onSeriesClick(seriesNumber: number, seasonNumber: number) {
    if (this.#onSeriesClick) {
      this.#onSeriesClick();
    }

    document.removeEventListener('keydown', this.#boundHandleKeyPress);
    let seriesCounter = 0;
    if (this.#currentSeason) {
      for (let i = 0; i < seasonNumber - 1; ++i) {
        if (this.#seasons) {
          this.#seasons[i].episodes.forEach(() => {
            seriesCounter++;
          });
        }
      }

      this.#currentSeason = seasonNumber;
      this.#currentSeries = seriesNumber;
      this.#seriesPosition = seriesCounter + seriesNumber;
    }

    if (this.#seasons) {
      this.#videoUrl =
        this.#seasons[seasonNumber - 1].episodes[seriesNumber - 1].video;
      this.#currentSeason = seasonNumber;
      this.#currentSeries = seriesNumber;
      this.#nextOrPrevClicked = false;
      if (this.#onVideoUpdate) {
        // this.#onVideoUpdate(
        //   this.#videoUrl,
        //   this.#currentSeason,
        //   this.#currentSeries,
        // );

        if (isiOS() && !this.#isModal) {
          this.#onVideoUpdate(
            this.#videoUrl,
            this.#currentSeason,
            this.#currentSeries,
            true,
          );
        } else {
          this.#onVideoUpdate(
            this.#videoUrl,
            this.#currentSeason,
            this.#currentSeries,
          );
        }
      }

      this.#nextOrPrevClicked = true;
    }
  }

  renderSeriesList() {
    const seriesBlock = document.getElementById('video-series') as HTMLElement;

    if (this.#seasons && this.#currentSeason && this.#currentSeries) {
      const seiesList = new SeriesList({
        parent: seriesBlock,
        seasons: this.#seasons,
        currentSeason: this.#currentSeason,
        currentSeries: this.#currentSeries,
        onSeriesClick: this.onSeriesClick.bind(this),
      });
      seiesList.render();
    }
  }

  seriesHandleMouseEnter() {
    const seriesBlock = document.getElementById('video-series') as HTMLElement;
    seriesBlock.classList.add('video__series_show');
    this.#isSeriesBlockVisible = true;
    clearTimeout(this.#hideControlsTimeout);
  }

  seriesHandleMouseLeave() {
    this.#seriesBlockTimeout = window.setTimeout(() => {
      const seriesBlock = document.getElementById(
        'video-series',
      ) as HTMLElement;
      seriesBlock.classList.remove('video__series_show');
      this.#isSeriesBlockVisible = false;

      if (!this.#controls.video.paused) {
        this.resetHideControlsTimer();
      }
    }, CLOSING_SERIES_MENU_TIMEOUT);
  }

  clearSeriesBlockTimeout() {
    if (this.#isSeriesBlockVisible) {
      clearTimeout(this.#seriesBlockTimeout);
    }
  }

  checkSeriesPosition() {
    if (this.#currentSeason && this.#currentSeries) {
      let seriesCounter = 0;
      for (let i = 0; i < this.#currentSeason - 1; ++i) {
        if (this.#seasons) {
          this.#seasons[i].episodes.forEach(() => {
            seriesCounter++;
          });
        }
      }

      this.#seriesPosition = seriesCounter + this.#currentSeries;
    }
  }

  onSeriesButtonClick() {
    const seriesBlock = document.getElementById('video-series') as HTMLElement;
    if (this.#isSeriesBlockVisible) {
      seriesBlock.classList.remove('video__series_show');
      this.#isSeriesBlockVisible = false;

      if (!this.#controls.video.paused) {
        this.resetHideControlsTimer();
      }
    } else {
      clearTimeout(this.#hideControlsTimeout);
      const seriesBlock = document.getElementById(
        'video-series',
      ) as HTMLElement;
      seriesBlock.classList.add('video__series_show');
      this.#isSeriesBlockVisible = true;
    }
  }

  onNextSeriesClick() {
    document.removeEventListener('keydown', this.#boundHandleKeyPress);
    if (
      this.#currentSeason &&
      this.#currentSeries &&
      this.#seasons &&
      this.#seriesPosition
    ) {
      this.#seriesPosition++;
      if (
        this.#currentSeries ===
        this.#seasons[this.#currentSeason - 1].episodes.length
      ) {
        this.#currentSeason++;
        this.#currentSeries = 1;
      } else {
        this.#currentSeries++;
      }

      if (this.#onVideoUpdate) {
        if (isiOS() && !this.#isModal) {
          this.#onVideoUpdate(
            this.#seasons[this.#currentSeason - 1].episodes[
              this.#currentSeries - 1
            ].video,
            this.#currentSeason,
            this.#currentSeries,
            true,
          );
        } else {
          this.#onVideoUpdate(
            this.#seasons[this.#currentSeason - 1].episodes[
              this.#currentSeries - 1
            ].video,
            this.#currentSeason,
            this.#currentSeries,
          );
        }
        // this.#onVideoUpdate(
        //   this.#seasons[this.#currentSeason - 1].episodes[
        //     this.#currentSeries - 1
        //   ].video,
        //   this.#currentSeason,
        //   this.#currentSeries,
        // );
      }
    }
  }

  onPrevSeriesClick() {
    document.removeEventListener('keydown', this.#boundHandleKeyPress);
    if (
      this.#currentSeason &&
      this.#currentSeries &&
      this.#seasons &&
      this.#seriesPosition
    ) {
      this.#seriesPosition--;
      if (this.#seasons && this.#currentSeries === 1) {
        this.#currentSeason--;
        this.#currentSeries =
          this.#seasons[this.#currentSeason - 1].episodes.length;
      } else {
        this.#currentSeries--;
      }

      if (this.#onVideoUpdate) {
        if (isiOS() && !this.#isModal) {
          this.#onVideoUpdate(
            this.#seasons[this.#currentSeason - 1].episodes[
              this.#currentSeries - 1
            ].video,
            this.#currentSeason,
            this.#currentSeries,
            true,
          );
        } else {
          this.#onVideoUpdate(
            this.#seasons[this.#currentSeason - 1].episodes[
              this.#currentSeries - 1
            ].video,
            this.#currentSeason,
            this.#currentSeries,
          );
        }
        // this.#onVideoUpdate(
        //   this.#seasons[this.#currentSeason - 1].episodes[
        //     this.#currentSeries - 1
        //   ].video,
        //   this.#currentSeason,
        //   this.#currentSeries,
        // );
      }
    }
  }

  handleIOSFullscreenEnd() {
    const { video } = this.#controls;
    video.removeAttribute('controls');
    this.resetHideControlsTimer();
    this.#controls.isFullScreen = false;
    this.#controls.fullOrSmallScreen.classList.add('video__controls_icon_full');
    this.#controls.fullOrSmallScreen.classList.remove(
      'video__controls_icon_small',
    );
  }

  handleIOSFullscreenIn() {
    this.#controls.isFullScreen = true;
  }

  handleSeekingIOS() {
    this.#isSeeking = true;

    if (this.#seekTimeout) {
      clearTimeout(this.#seekTimeout);
    }
  }

  handleSeekedIOS() {
    const { video } = this.#controls;

    if (this.#isSeeking) {
      this.#isSeeking = false;
      this.#seekTimeout = setTimeout(() => {
        if (!this.#wasRewindByOthers) {
          if (this.#handleRewindVideo && this.#controls.isFullScreen) {
            this.#handleRewindVideo(video.currentTime);
          }
        } else {
          this.#wasRewindByOthers = false;
        }
      }, 300);
    }
  }

  handlePlayOrPauseIOS() {
    if (!this.#wasPlayOrPauseByOthers) {
      if (this.#controls.isFullScreen) {
        if (this.#controls.video.paused && this.#onPauseClick) {
          this.#onPauseClick(this.#controls.video.currentTime);
        } else if (this.#onPlayClick) {
          this.#onPlayClick(this.#controls.video.currentTime);
        }
      }
    } else {
      this.#wasPlayOrPauseByOthers = false;
    }
  }
}
