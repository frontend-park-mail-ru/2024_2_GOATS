import template from './VideoPlayer.hbs';

export class VideoPlayer {
  #parent;
  #url;
  #isPlaying;

  constructor(parent: HTMLElement, url: string) {
    this.#parent = parent;
    this.#url = url;
    this.#isPlaying = false;
  }

  render() {
    this.renderTemplate();
  }

  timeFormatter(timeInput: number) {
    const minute = Math.floor(timeInput / 60);
    const minuteString = minute < 10 ? '0' + minute : minute;
    const second = Math.floor(timeInput % 60);
    const secondString = second < 10 ? '0' + second : second;
    return `${minuteString}:${secondString}`;
  }

  renderTemplate() {
    const isPlaying = this.#isPlaying;
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({ url: this.#url, isPlaying }),
    );

    const video = document.getElementById('video') as HTMLVideoElement;

    const controls = {
      playOrPause: document.getElementById('play-pause') as HTMLElement,
      togglePlayback: () => {
        video.paused ? video.play() : video.pause();
      },

      playbackline: document.querySelector('.video__progress') as HTMLElement,
      duration: document.getElementById('duration') as HTMLElement,
      currentTime: document.getElementById('currenttime') as HTMLElement,
      progressBar: document.querySelector(
        '.video__progress_bar',
      ) as HTMLElement,
    };

    // Определяем длительность видео
    video.addEventListener(
      'canplay',
      () => {
        controls.duration.textContent = this.timeFormatter(video.duration);
      },
      false,
    );

    // Проигрывание/пауза видео
    controls.playOrPause.addEventListener('click', () => {
      controls.togglePlayback();
      this.#isPlaying = !this.#isPlaying;
    });

    video.addEventListener('play', () => {
      controls.playOrPause.textContent = 'Pause';
      controls.playOrPause.classList.toggle('paused');
    });

    video.addEventListener('pause', () => {
      controls.playOrPause.textContent = 'Play';
      controls.playOrPause.classList.toggle('paused');
    });

    // Проигрывание/пауза при нажатии на само видео
    video.addEventListener('click', () => {
      controls.togglePlayback();
      this.#isPlaying = !this.#isPlaying;
    });

    // При окончании видео ставим на паузу и активируем кнопку проигрывания
    video.addEventListener('ended', () => {
      video.pause();
      controls.playOrPause.textContent = 'Play';
      controls.playOrPause.classList.toggle('paused');
    });

    // Обновление времени и ползунка видео
    video.addEventListener('timeupdate', () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const percentage = (currentTime / duration) * 100;
      controls.progressBar.style.width = percentage + '%';
      controls.currentTime.textContent = this.timeFormatter(currentTime);
    });

    // Изменение времени проигрывания видео через ползунок
    controls.playbackline.addEventListener('click', (e) => {
      let timelineWidth = controls.playbackline.clientWidth;
      video.currentTime = (e.offsetX / timelineWidth) * video.duration;
      controls.currentTime.textContent = this.timeFormatter(video.currentTime);
    });
  }
}
