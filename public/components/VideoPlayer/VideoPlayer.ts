import template from './VideoPlayer.hbs';
import { timeFormatter } from 'modules/TimeFormatter';
import { VideoControls } from 'types/video';

export class VideoPlayer {
  #parent;
  #url;
  #isPlaying;
  #controls!: VideoControls;

  constructor(parent: HTMLElement, url: string) {
    this.#parent = parent;
    this.#url = url;
    this.#isPlaying = false;
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
      volumeBtn: document.getElementById('volume-button') as HTMLElement,
      volume: document.getElementById('volume') as HTMLInputElement,
      fullOrSmallScreen: document.getElementById('full-small') as HTMLElement,
      isFullScreen: false,
      rewindBackButton: document.getElementById(
        'rewind-back-button',
      ) as HTMLElement,
      rewindFrontButton: document.getElementById(
        'rewind-front-button',
      ) as HTMLElement,
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
    } = this.#controls;

    video.addEventListener('canplay', this.updateDuration.bind(this));
    video.addEventListener('play', this.onPlay.bind(this));
    video.addEventListener('pause', this.onPause.bind(this));
    video.addEventListener('timeupdate', this.updateProgress.bind(this));
    video.addEventListener('ended', this.onVideoEnd.bind(this));

    playOrPause.addEventListener('click', this.togglePlayback.bind(this));
    video.addEventListener('click', this.togglePlayback.bind(this));

    rewindBackButton.addEventListener(
      'click',
      this.addRewindBackControl.bind(this),
    );
    rewindFrontButton.addEventListener(
      'click',
      this.addRewindFrontControl.bind(this),
    );

    fullOrSmallScreen.addEventListener(
      'click',
      this.toggleFullScreen.bind(this),
    );

    this.addVolumeControls();
    this.addProgressControls();
  }

  // Обработчики событий вынесены в отдельные методы
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
    // playOrPause.textContent = 'Play';
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

  // Управление звуком
  addVolumeControls() {
    const { volumeBtn, volume, video } = this.#controls;

    volumeBtn.addEventListener('click', () => {
      volume.style.display =
        volume.style.display === 'block' ? 'none' : 'block';
    });

    volume.addEventListener('input', () => {
      video.volume = Number(volume.value);
    });
  }

  // Управление прогрессом воспроизведения
  addProgressControls() {
    const { playbackline, video } = this.#controls;

    playbackline.addEventListener('click', (e: MouseEvent) => {
      const timelineWidth = playbackline.clientWidth;
      const newTime = (e.offsetX / timelineWidth) * video.duration;
      video.currentTime = newTime;
    });
  }

  addRewindBackControl() {
    const { video } = this.#controls;
    video.currentTime -= 15;
  }

  addRewindFrontControl() {
    const { video } = this.#controls;
    video.currentTime += 15;
  }
}
