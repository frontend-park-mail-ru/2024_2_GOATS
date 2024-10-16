import template from './VideoPlayer.hbs';
import { timeFormatter } from 'modules/TimeFormatter';
import { VideoControls } from 'types/video';

export class VideoPlayer {
  #parent;
  #url;
  #isPlaying;
  #controls!: VideoControls;
  #hideControlsTimeout!: number;
  #onBackClick;

  constructor(parent: HTMLElement, url: string, onBackClick: () => void) {
    this.#parent = parent;
    this.#url = url;
    this.#isPlaying = false;
    this.#onBackClick = onBackClick;
  }

  render() {
    this.renderTemplate();
    this.initControls();
    this.addEventListeners();
  }

  renderTemplate() {
    const isPlaying = this.#isPlaying;
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ url: this.#url, isPlaying }),
    );
    const root = document.getElementById('root') as HTMLElement;
    root.classList.add('lock');
  }

  // Инициализация всех элементов управления
  initControls() {
    this.#controls = {
      video: document.getElementById('video') as HTMLVideoElement,
      videoWrapper: document.querySelector('.video__wrapper') as HTMLElement,
      playOrPause: document.getElementById('play-pause') as HTMLElement,
      playbackline: document.querySelector('.video__progress') as HTMLElement,
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
      playbackline,
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

    playbackline.addEventListener('click', (e: MouseEvent) =>
      this.updateProgressByClick(e),
    );

    document.addEventListener(
      'fullscreenchange',
      this.checkScreenButton.bind(this),
    );

    this.initAutoHideControls();
    this.handleBackButtonClick();

    document.addEventListener('keydown', this.handleKeyPress.bind(this));
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
    const { playOrPause } = this.#controls;
    playOrPause.classList.add('video__controls_icon_pause');
    playOrPause.classList.remove('video__controls_icon_play');
  }

  onPause() {
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
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    this.#isPlaying = !this.#isPlaying;
  }

  updateProgress() {
    const { video, progressBar, currentTime } = this.#controls;
    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.style.width = percentage + '%';
    currentTime.textContent = timeFormatter(video.currentTime);
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

  // Управление прогрессом воспроизведения
  updateProgressByClick(e: MouseEvent) {
    const { playbackline, video } = this.#controls;

    const timelineWidth = playbackline.clientWidth;
    const newTime = (e.offsetX / timelineWidth) * video.duration;
    video.currentTime = newTime;
  }

  rewindBack() {
    const { video } = this.#controls;
    video.currentTime -= 15;
  }

  rewindFront() {
    const { video } = this.#controls;
    video.currentTime += 15;
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
    this.#controls.videoBackButton.classList.remove('video__controls_hidden');

    this.#hideControlsTimeout = window.setTimeout(() => {
      this.#controls.videoControls.classList.add('video__controls_hidden');
      this.#controls.videoBackButton.classList.add('video__controls_hidden');
    }, 3000);
  }

  handleBackButtonClick() {
    this.#controls.videoBackButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.#onBackClick();
      const root = document.getElementById('root') as HTMLElement;
      root.classList.remove('lock');
    });
  }
}
