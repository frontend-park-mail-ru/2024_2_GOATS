import template from './VideoPlayer.hbs';
import { timeFormatter } from 'modules/TimeFormatter';
import { VideoControls } from 'types/video';
import { isTabletOrMobileLandscape } from 'modules/IsMobileDevice';
import { PLAYER_CONTROLL_HIDING_TIMEOUT } from '../../consts';

export class VideoPlayer {
  #parent;
  #url;
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
  #hasNextSeries;
  #hasPrevSeries;
  #onNextButtonClick;
  #onPrevButtonClick;
  #handleSaveTimecode;
  #boundHandleKeyPress;

  constructor(params: {
    parent: HTMLElement;
    url: string;
    hasNextSeries: boolean;
    hasPrevSeries: boolean;
    startTimeCode?: number;
    onBackClick?: () => void;
    onPlayClick?: (timeCode: number) => void;
    onPauseClick?: (timeCode: number) => void;
    handleRewindVideo?: (timeCode: number) => void;
    hanldeIntervalTick?: (timeCode: number) => void;
    onNextButtonClick?: () => void;
    onPrevButtonClick?: () => void;
    handleSaveTimecode?: (timeCode: number, duration: number) => void;
  }) {
    this.#parent = params.parent;
    this.#url = params.url;
    this.#isPlaying = false;
    this.#startTimeCode = params.startTimeCode;
    this.#onBackClick = params.onBackClick;
    this.#onPlayClick = params.onPlayClick;
    this.#onPauseClick = params.onPauseClick;
    this.#handleRewindVideo = params.handleRewindVideo;
    this.#hanldeIntervalTick = params.hanldeIntervalTick;
    this.#isModal = params.onBackClick ? true : false;
    this.#hasNextSeries = params.hasNextSeries;
    this.#hasPrevSeries = params.hasPrevSeries;
    this.#onNextButtonClick = params.onNextButtonClick;
    this.#onPrevButtonClick = params.onPrevButtonClick;
    this.#handleSaveTimecode = params.handleSaveTimecode;
    this.#boundHandleKeyPress = this.handleKeyPress.bind(this);
  }

  render() {
    this.renderTemplate();
    this.initControls();
    this.addEventListeners();

    if (this.#startTimeCode) {
      this.#controls.video.currentTime = this.#startTimeCode;
    }
  }

  renderTemplate() {
    const isPlaying = this.#isPlaying;
    this.#parent.innerHTML = template({
      url: this.#url,
      isPlaying,
      isModal: this.#isModal,
      hasNextSeries: this.#hasNextSeries,
      hasPrevSeries: this.#hasPrevSeries,
    });
    const root = document.getElementById('root') as HTMLElement;
    if (this.#isModal) {
      root.classList.add('lock');
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
      isFullScreen: false,
      videoBackButton: document.getElementById(
        'video-back-button',
      ) as HTMLElement,
      videoControls: document.getElementById('video-controls') as HTMLElement,
      videoPlaceholder: document.getElementById(
        'video-placeholder',
      ) as HTMLElement,
    };

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

    this.#controls.volume.style.setProperty('--progress-volume-value', '100%');
  }

  // Добавляем все события
  addEventListeners() {
    const { video, fullOrSmallScreen, volume } = this.#controls;

    video.addEventListener('canplay', this.updateDuration.bind(this));
    video.addEventListener('play', this.onPlay.bind(this));
    video.addEventListener('pause', this.onPause.bind(this));
    video.addEventListener('timeupdate', this.updateProgress.bind(this));
    video.addEventListener('ended', this.onVideoEnd.bind(this));
    video.addEventListener('loadeddata', this.hidePlaceholder.bind(this));

    fullOrSmallScreen.addEventListener(
      'click',
      this.toggleFullScreen.bind(this),
    );

    volume.addEventListener('input', this.updateVolumeByClick.bind(this));

    document.addEventListener(
      'fullscreenchange',
      this.checkScreenButton.bind(this),
    );

    this.initAutoHideControls();

    if (this.#isModal) {
      this.handleBackButtonClick();
    }

    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    slider.disabled = true;

    slider.addEventListener('mousedown', this.onSliderMouseDown.bind(this));
    slider.addEventListener('mouseup', this.onSliderMouseUp.bind(this));
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
        if (this.#onNextButtonClick) {
          this.#onNextButtonClick();
        }
      });
    }

    if (prevSeriesButton) {
      prevSeriesButton.addEventListener('click', () => {
        if (this.#onPrevButtonClick) {
          this.#onPrevButtonClick();
        }
      });
    }

    document.addEventListener('keydown', this.#boundHandleKeyPress);

    window.addEventListener('beforeunload', () => {
      if (this.#handleSaveTimecode) {
        this.#handleSaveTimecode(video.currentTime, video.duration);
      }
    });
  }

  // Вспомогательные функции для использования снаружи
  getCurrentVideoTime() {
    const { video } = this.#controls;
    return video.currentTime;
  }

  videoPlay() {
    const { video } = this.#controls;
    video.play();
    this.intervalTick();
  }

  videoPause(timeCode: number) {
    const { video } = this.#controls;
    video.pause();
    video.currentTime = timeCode;
    clearInterval(this.#tickInterval);
  }

  videoRewind(timeCode: number) {
    const { video } = this.#controls;
    video.currentTime = timeCode;
  }

  // Обработчики событий
  onSliderMouseDown() {
    this.#isDragging = true;
  }

  onSliderMouseUp() {
    this.#isDragging = false;
  }

  updateProgress() {
    if (this.#isDragging) return;
    const { video } = this.#controls;
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
      this.#controls.currentTime.textContent = timeFormatter(video.currentTime);
    }
  }

  updateSliderByInput() {
    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    const percentage = slider.value;

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
    // TODO: Обработать автовоспроизведение
    // video.play();
  }

  onPlay() {
    if (this.#onPlayClick) {
      this.#onPlayClick(this.#controls.video.currentTime);
    }
    const { playOrPause } = this.#controls;
    playOrPause?.classList.add('video__controls_icon_pause');
    playOrPause?.classList.remove('video__controls_icon_play');
  }

  onPause() {
    if (this.#onPauseClick) {
      this.#onPauseClick(this.#controls.video.currentTime);
    }
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
      video.play();
      this.intervalTick();
    } else {
      video.pause();
      clearInterval(this.#tickInterval);
    }
    this.#isPlaying = !this.#isPlaying;
  }

  toggleFullScreen() {
    const { videoWrapper, isFullScreen } = this.#controls;
    if (isFullScreen) {
      document.exitFullscreen();
      this.#controls.isFullScreen = false;
      this.#controls.fullOrSmallScreen.classList.add(
        'video__controls_icon_full',
      );
      this.#controls.fullOrSmallScreen.classList.remove(
        'video__controls_icon_small',
      );
    } else {
      videoWrapper.requestFullscreen();
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
  }

  updateVolumeByClick() {
    const { volume, video } = this.#controls;
    const percentage = Number(volume.value) * 100;
    volume.style.setProperty('--progress-volume-value', `${percentage}%`);
    video.volume = Number(volume.value);
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
    const { videoWrapper } = this.#controls;

    videoWrapper.addEventListener(
      'mousemove',
      this.resetHideControlsTimer.bind(this),
    );
    this.resetHideControlsTimer();
  }

  // Показываем и скрываем плеер по таймеру
  resetHideControlsTimer() {
    clearTimeout(this.#hideControlsTimeout);

    this.#controls.videoControls.classList.remove('video__controls_hidden');
    if (this.#isModal) {
      this.#controls.videoBackButton.classList.remove('video__controls_hidden');
    }

    this.#controls.videoMobileControls?.classList.remove(
      'video__controls_hidden',
    );

    this.#hideControlsTimeout = window.setTimeout(() => {
      this.#controls.videoControls.classList.add('video__controls_hidden');
      this.#controls.videoControls.classList.add('video__controls_hidden');

      if (this.#isModal) {
        this.#controls.videoMobileControls?.classList.add(
          'video__controls_hidden',
        );
      }
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
        if (this.#handleSaveTimecode) {
          this.#handleSaveTimecode(video.currentTime, video.duration);
        }

        document.removeEventListener('keydown', this.#boundHandleKeyPress);
      }
      const root = document.getElementById('root') as HTMLElement;
      root.classList.remove('lock');
    });
  }

  hidePlaceholder() {
    const { videoPlaceholder } = this.#controls;
    videoPlaceholder.style.display = 'none';

    this.addControlsListeners();
  }
}
