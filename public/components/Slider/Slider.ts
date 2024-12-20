import { Card } from 'components/Card/Card';
import { SeriesCard } from 'components/SeriesCard/SeriesCard';
import { PersonCard } from 'components/PersonCard/PersonCard';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import template from './Slider.hbs';
import { Episode, MovieSaved, MovieSelection } from 'types/movie';
import { PersonCardData } from 'types/actor';
import { ProgressCard } from 'components/ProgressCard/ProgressCard';
import { MovieBigCard } from 'components/MovieBigCard/MovieBigCard';
import { router } from 'modules/Router';

export class Slider {
  #parent;
  #type;
  #selection;
  #series;
  #persons;
  #savedMovies;
  #id;
  #leftDiff;
  #rightDiff;
  #onSeriesClick;
  #title;

  constructor(params: {
    parent: HTMLElement;
    id: number;
    type: 'selection' | 'series' | 'actors' | 'movies' | 'progress';
    selection?: MovieSelection;
    series?: Episode[];
    persons?: PersonCardData[];
    savedMovies?: MovieSaved[];
    onSeriesClick?: (episodeNumber: number) => void;
  }) {
    this.#parent = params.parent;
    this.#id = params.id;
    this.#type = params.type;
    this.#selection = params.selection;
    this.#series = params.series;
    this.#persons = params.persons;
    this.#savedMovies = params.savedMovies;
    this.#onSeriesClick = params.onSeriesClick;
    this.#leftDiff = 0;
    this.#rightDiff = 0;
    this.#title = '';
  }

  render() {
    this.renderTemplate();
  }

  checkBtns() {
    const btnNext = document.getElementById(
      `slider-btn-next-${this.#type}-${this.#id}`,
    ) as HTMLButtonElement;
    const btnPrev = document.getElementById(
      `slider-btn-prev-${this.#type}-${this.#id}`,
    ) as HTMLButtonElement;

    if (btnNext && btnPrev) {
      if (this.#rightDiff <= 0) {
        btnNext.disabled = true;
      } else {
        btnNext.disabled = false;
      }

      if (this.#leftDiff <= 0) {
        btnPrev.disabled = true;
      } else {
        btnPrev.disabled = false;
      }
    }
  }

  getSliderTitle() {
    let title = '';

    switch (this.#type) {
      case 'selection':
        if (this.#selection) {
          title = this.#selection.title;
        }
        break;
      case 'actors':
        title = 'Актеры и создатели';
        break;
      case 'progress':
        title = 'Вы недавно смотрели';
        break;
      case 'movies':
        if (this.#selection) {
          title = this.#selection.title;
        }
        break;
    }

    return title;
  }

  renderTemplate() {
    if (this.#type === 'series') {
      this.#parent.innerHTML = template({
        id: this.#id,
        type: this.#type,
      });
    } else {
      this.#parent.insertAdjacentHTML(
        'beforeend',
        template({
          id: this.#id,
          type: this.#type,
          title: this.getSliderTitle(),
        }),
      );
    }

    const container = document.querySelector('.slider__container');
    const track = document.getElementById(
      `slider-${this.#type}-${this.#id}`,
    ) as HTMLElement;
    const btnNext = document.getElementById(
      `slider-btn-next-${this.#type}-${this.#id}`,
    );
    const btnPrev = document.getElementById(
      `slider-btn-prev-${this.#type}-${this.#id}`,
    );

    if (!this.#selection && !this.#persons && !this.#series) {
      // TODO: Поменять условие
      let blocksElement;
      if (this.#type === 'selection' || this.#type === 'movies') {
        blocksElement = document.querySelector(
          '.main-page__blocks',
        ) as HTMLDivElement;

        if (!blocksElement) {
          blocksElement = document.querySelector(
            '.genres-page__blocks',
          ) as HTMLDivElement;
        }
      } else if (this.#type === 'actors') {
        blocksElement = document.getElementById(
          'movie-page-persons',
        ) as HTMLElement;
      }
      const sliderSkeleton = document.createElement('div');
      sliderSkeleton.classList.add('slider-skeleton__wrapper');
      blocksElement?.appendChild(sliderSkeleton);

      const sliderHeader = document.createElement('div');
      sliderHeader.classList.add('slider-skeleton__header');
      sliderSkeleton.appendChild(sliderHeader);

      const newBlock = document.createElement('div');
      newBlock.classList.add('slider-skeleton');
      sliderSkeleton.appendChild(newBlock);
      if (this.#type === 'selection' || this.#type === 'actors') {
        for (let i = 0; i < 10; ++i) {
          const card = new Card(newBlock, null, () => {});
          card.render();
        }
      } else {
        const card = new MovieBigCard(newBlock, null, () => {});
        card.render();
      }
    }

    if (container && track && btnNext && btnPrev) {
      const gapValue = parseInt(window.getComputedStyle(track).gap);

      btnNext.addEventListener('click', () => {
        // Проверяем, на сколько пикселей нужно двигать (на всю ширину блока или на остаток)
        if (this.#rightDiff >= container.clientWidth) {
          track.style.transform = `translateX(-${
            this.#leftDiff + container.clientWidth + gapValue
          }px)`;

          // Двигаем левую и правую границу
          this.#rightDiff -= container.clientWidth + gapValue;
          this.#leftDiff += container.clientWidth + gapValue;
        } else {
          track.style.transform = `translateX(-${
            this.#leftDiff + this.#rightDiff
          }px)`;
          this.#leftDiff += this.#rightDiff;
          this.#rightDiff = 0;
        }

        this.checkBtns();
      });

      btnPrev.addEventListener('click', () => {
        if (this.#leftDiff >= container.clientWidth) {
          track.style.transform = `translateX(-${
            this.#leftDiff - container.clientWidth - gapValue
          }px)`;
          this.#rightDiff += container.clientWidth + gapValue;
          this.#leftDiff -= container.clientWidth + gapValue;
        } else {
          track.style.transform = `translateX(0px)`;
          this.#rightDiff += this.#leftDiff;
          this.#leftDiff = 0;
        }

        this.checkBtns();
      });

      switch (this.#type) {
        case 'selection':
          if (this.#selection) {
            this.#title = this.#selection.title;
          }
          this.#selection?.movies.forEach((movie) => {
            const card = new Card(
              track,
              movie,
              () => {
                router.go('/movie', movie.id);
              },
              `${this.#id}-${movie.id}`,
            );
            card.render();
          });
          break;
        case 'series':
          this.#series?.forEach((series) => {
            const seriesCard = new SeriesCard(
              track,
              series,
              this.#onSeriesClick ? this.#onSeriesClick : () => {},
            );
            seriesCard.render();
          });
          break;
        case 'actors':
          this.#title = 'Актеры и создатели';
          this.#persons?.forEach((person) => {
            const personCard = new PersonCard(track, person, () => {
              router.go('/person', person.id);
            });
            personCard.render();
          });
          break;
        case 'movies':
          if (this.#selection) {
            this.#title = this.#selection.title;
          }
          this.#selection?.movies.forEach((movie) => {
            const movieBigCard = new MovieBigCard(track, movie, () => {
              router.go('/movie', movie.id);
            });
            movieBigCard.render();
          });
          break;
        default:
          this.#title = 'Вы недавно смотрели';
          this.#savedMovies?.forEach((movie) => {
            const progressCard = new ProgressCard(track, movie, () => {
              router.go('/movie', movie.id, {
                fromRecentlyWatched: true,
                receivedSeason: movie.season,
                receivedSeries: movie.series,
              });
            });
            progressCard.render();
          });
      }

      // Записываем разницу между track и container для скролла вправо
      this.#rightDiff = track.clientWidth - container.clientWidth;
      this.checkBtns();
    }
  }

  kill() {
    const removedSlider = document.getElementById(
      `slider-container-${this.#type}-${this.#id}`,
    ) as HTMLDivElement;

    if (removedSlider) {
      removedSlider.remove();
    }
  }
}
