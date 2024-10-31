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
  #selection;
  #series;
  #persons;
  #id;
  #leftDiff;
  #rightDiff;

  constructor(
    parent: HTMLElement,
    selection?: MovieSelection,
    series?: Series[],
    persons?: PersonCardData[],
  ) {
    this.#parent = parent;
    this.#selection = selection;
    this.#series = series;
    this.#persons = persons;

    if (selection) {
      this.#id = selection.id;
    } else if (series) {
      this.#id = series[0].id;
    } else if (persons) {
      this.#id = persons[0].id + 10;
    }
    this.#leftDiff = 0;
    this.#rightDiff = 0;
  }

  render() {
    this.renderTemplate();
  }

  checkBtns() {
    const btnNext = document.getElementById(
      `slider-btn-next-${this.#id}`,
    ) as HTMLButtonElement;
    const btnPrev = document.getElementById(
      `slider-btn-prev-${this.#id}`,
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
    if (this.#selection) {
      this.#parent.insertAdjacentHTML(
        'beforeend',
        template({ id: this.#id, title: this.#selection.title }),
      );
    } else if (this.#series) {
      this.#parent.insertAdjacentHTML(
        'beforeend',
        template({ id: this.#id, title: '' }),
      );
    } else if (this.#persons) {
      this.#parent.insertAdjacentHTML(
        'beforeend',
        template({ id: this.#id, title: 'Актеры и создатели' }),
      );
    }

    const container = document.querySelector('.slider__container');
    const track = document.getElementById(`slider-${this.#id}`);
    const btnNext = document.getElementById(`slider-btn-next-${this.#id}`);
    const btnPrev = document.getElementById(`slider-btn-prev-${this.#id}`);

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

      if (this.#selection) {
        this.#selection.movies.forEach((movie) => {
          const card = new Card(track, movie, () => {
            router.go('/movie', movie.id);
          });
          card.render();
        });
      } else if (this.#series) {
        this.#series.forEach((series) => {
          const seriesCard = new SeriesCard(track, series, () => {
            const moviePage = document.getElementById(
              'movie-page',
            ) as HTMLElement;
            const video = new VideoPlayer(
              moviePage,
              series.video,
              true,
              true,
              () => router.go('/movie'),
            );
            video.render();
          });
          seriesCard.render();
        });
      } else if (this.#persons) {
        this.#persons.forEach((person) => {
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
