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
      fullScreenBtn: document.getElementById(
        'full-screen-button',
      ) as HTMLElement,
      isFullScreen: false,
    };
  }

  // Добавляем все события
  addEventListeners() {
    const { video, playOrPause, fullScreenBtn } = this.#controls;

    video.addEventListener('canplay', this.updateDuration.bind(this));
    video.addEventListener('play', this.onPlay.bind(this));
    video.addEventListener('pause', this.onPause.bind(this));
    video.addEventListener('timeupdate', this.updateProgress.bind(this));
    video.addEventListener('ended', this.onVideoEnd.bind(this));

    playOrPause.addEventListener('click', this.togglePlayback.bind(this));
    video.addEventListener('click', this.togglePlayback.bind(this));

    fullScreenBtn.addEventListener('click', this.toggleFullScreen.bind(this));

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
    playOrPause.textContent = 'Pause';
    playOrPause.classList.add('paused');
  }

  onPause() {
    const { playOrPause } = this.#controls;
    playOrPause.textContent = 'Play';
    playOrPause.classList.remove('paused');
  }

  onVideoEnd() {
    const { video, playOrPause } = this.#controls;
    video.pause();
    playOrPause.textContent = 'Play';
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
    } else {
      videoWrapper.requestFullscreen();
      this.#controls.isFullScreen = true;
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
}
