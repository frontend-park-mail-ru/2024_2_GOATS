import template from './VideoPlayer.hbs';
import { timeFormatter } from 'modules/TimeFormatter';
import { VideoControls } from 'types/video';

export class VideoPlayer {
  #parent;
  #url;
  #isPlaying;
  #controls!: VideoControls;
  #hideControlsTimeout!: number;
  #tickInterval!: number;
  #onBackClick;
  #onPauseClick;
  #onPlayClick;
  #handleRewindVideo;
  #isDragging = false;
  #isModal;
  #hanldeIntervalTick;

  constructor(
    parent: HTMLElement,
    url: string,
    onBackClick?: () => void,
    onPlayClick?: (timeCode: number) => void,
    onPauseClick?: (timeCode: number) => void,
    handleRewindVideo?: (timeCode: number) => void,
    hanldeIntervalTick?: (timeCode: number) => void,
  ) {
    this.#parent = parent;
    this.#url = url;
    this.#isPlaying = false;
    this.#onBackClick = onBackClick;
    this.#onPlayClick = onPlayClick;
    this.#onPauseClick = onPauseClick;
    this.#handleRewindVideo = handleRewindVideo;
    this.#hanldeIntervalTick = hanldeIntervalTick;
    this.#isModal = onBackClick ? true : false;
  }

  render() {
    this.renderTemplate();
    this.initControls();
    this.addEventListeners();
  }

  renderTemplate() {
    const isPlaying = this.#isPlaying;
    this.#parent.innerHTML = template({
      url: this.#url,
      isPlaying,
      isModal: this.#isModal,
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
      playOrPause: document.getElementById('play-pause') as HTMLElement,
      duration: document.getElementById('duration') as HTMLElement,
      currentTime: document.getElementById('current-time') as HTMLElement,
      progressBar: document.querySelector(
        '.video__progress_bar',
      ) as HTMLElement,
      volume: document.getElementById('volume-input') as HTMLInputElement,
      isVolumeOpened: false,
      fullOrSmallScreen: document.getElementById('full-small') as HTMLElement,
      isFullScreen: false,
      rewindBackButton: document.getElementById(
        'rewind-back-button',
      ) as HTMLElement,
      rewindFrontButton: document.getElementById(
        'rewind-front-button',
      ) as HTMLElement,
      videoBackButton: document.getElementById(
        'video-back-button',
      ) as HTMLElement,
      videoControls: document.getElementById('video-controls') as HTMLElement,
    };
  }

  // Добавляем все события
  addEventListeners() {
    const {
      video,
      playOrPause,
      fullOrSmallScreen,
      rewindBackButton,
      rewindFrontButton,
      volume,
    } = this.#controls;

    video.addEventListener('canplay', this.updateDuration.bind(this));
    video.addEventListener('play', this.onPlay.bind(this));
    video.addEventListener('pause', this.onPause.bind(this));
    video.addEventListener('timeupdate', this.updateProgress.bind(this));
    video.addEventListener('ended', this.onVideoEnd.bind(this));

    playOrPause.addEventListener('click', this.togglePlayback.bind(this));
    video.addEventListener('click', this.togglePlayback.bind(this));

    rewindBackButton.addEventListener('click', this.rewindBack.bind(this));
    rewindFrontButton.addEventListener('click', this.rewindFront.bind(this));

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

    document.addEventListener('keydown', this.handleKeyPress.bind(this));

    const slider = document.getElementById(
      'progress-slider',
    ) as HTMLInputElement;
    slider.addEventListener('input', this.updateSliderByInput.bind(this));

    slider.addEventListener('change', this.setVideoTimeBySlider.bind(this));

    slider.addEventListener('mousedown', this.onSliderMouseDown.bind(this));
    slider.addEventListener('mouseup', this.onSliderMouseUp.bind(this));
  }

  // Вспомогательные функции для использования снаружи
  getCurrentVideoTime() {
    const { video } = this.#controls;
    return video.currentTime;
  }

  videoPlay() {
    const { video } = this.#controls;
    video.play();
  }

  videoPause(timeCode: number) {
    const { video } = this.#controls;
    video.pause();
    video.currentTime = timeCode;
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
    const { video, playOrPause } = this.#controls;

    if (event.key === ' ') {
      event.preventDefault();
      this.togglePlayback();
    }
  }

  // Обработчики событий в отдельных методах
  updateDuration() {
    const { video, duration } = this.#controls;
    duration.textContent = timeFormatter(video.duration);
  }

  onPlay() {
    if (this.#onPlayClick) {
      this.#onPlayClick(this.#controls.video.currentTime);
    }
    const { playOrPause } = this.#controls;
    playOrPause.classList.add('video__controls_icon_pause');
    playOrPause.classList.remove('video__controls_icon_play');
  }

  onPause() {
    if (this.#onPauseClick) {
      this.#onPauseClick(this.#controls.video.currentTime);
    }
    const { playOrPause } = this.#controls;
    playOrPause.classList.add('video__controls_icon_play');
    playOrPause.classList.remove('video__controls_icon_pause');
  }

  onVideoEnd() {
    const { video, playOrPause } = this.#controls;
    video.pause();
    playOrPause.classList.remove('paused');
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

    this.#hideControlsTimeout = window.setTimeout(() => {
      this.#controls.videoControls.classList.add('video__controls_hidden');

      if (this.#isModal) {
        this.#controls.videoBackButton.classList.add('video__controls_hidden');
      }
    }, 300000);
  }

  // Для выполнения функции каждые 3 секунды во время проигрывания видео
  intervalTick() {
    clearInterval(this.#tickInterval);

    this.#tickInterval = window.setInterval(() => {
      if (this.#hanldeIntervalTick) {
        this.#hanldeIntervalTick(this.#controls.video.currentTime);
      }
    }, 3000);
  }

  handleBackButtonClick() {
    this.#controls.videoBackButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.#onBackClick) {
        this.#onBackClick();
      }
      const root = document.getElementById('root') as HTMLElement;
      root.classList.remove('lock');
    });
  }
}
