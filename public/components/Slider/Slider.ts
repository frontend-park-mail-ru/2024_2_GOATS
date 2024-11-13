import { Card } from 'components/Card/Card';
import { SeriesCard } from 'components/SeriesCard/SeriesCard';
import { PersonCard } from 'components/PersonCard/PersonCard';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import template from './Slider.hbs';
import { MovieSelection, Series } from 'types/movie';
import { PersonCardData } from 'types/actor';
import { router } from 'modules/Router';

export class Slider {
  #parent;
  #type;
  #selection;
  #series;
  #persons;
  #id;
  #leftDiff;
  #rightDiff;

  constructor(params: {
    parent: HTMLElement;
    id: number;
    type: 'movies' | 'series' | 'actors';
    selection?: MovieSelection;
    series?: Series[];
    persons?: PersonCardData[];
  }) {
    this.#parent = params.parent;
    this.#id = params.id;
    this.#type = params.type;
    this.#selection = params.selection;
    this.#series = params.series;
    this.#persons = params.persons;
    this.#leftDiff = 0;
    this.#rightDiff = 0;
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

  renderTemplate() {
    console.log('render slider');
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({
        id: this.#id,
        type: this.#type,
        title:
          this.#selection || this.#persons || this.#series
            ? this.#type === 'movies'
              ? this.#selection?.title
              : this.#type === 'actors'
                ? 'Актеры и создатели'
                : ''
            : undefined,
      }),
    );

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
      console.log('ifff');
      // TODO: Поменять условие
      let blocksElement;
      if (this.#type === 'movies') {
        blocksElement = document.querySelector(
          '.main-page__blocks',
        ) as HTMLDivElement;
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

      for (let i = 0; i < 10; ++i) {
        const card = new Card(newBlock, null, () => {});
        card.render();
      }
    } else {
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

      if (this.#type === 'movies') {
        this.#selection?.movies.forEach((movie) => {
          const card = new Card(track, movie, () => {
            router.go('/movie', movie.id);
          });
          card.render();
        });
      } else if (this.#type === 'series') {
        this.#series?.forEach((series) => {
          const seriesCard = new SeriesCard(track, series, () => {
            const moviePage = document.getElementById(
              'movie-page',
            ) as HTMLElement;
            const video = new VideoPlayer({
              parent: moviePage,
              url: series.video,
              hasNextSeries: true,
              hasPrevSeries: true,
              onBackClick: () => router.go('/movie'),
            });
            video.render();
          });
          seriesCard.render();
        });
      } else {
        this.#persons?.forEach((person) => {
          const personCard = new PersonCard(track, person, () => {
            router.go('/person', person.id);
          });
          personCard.render();
        });
      }

      // Записываем разницу между track и container для скролла вправо
      this.#rightDiff = track.clientWidth - container.clientWidth;
      this.checkBtns();
    }
  }
}
