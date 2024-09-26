import { Card } from '../Card/Card';
import template from './Slider.hbs';

export class Slider {
  #parent;
  #movies;
  #id;
  #leftDiff;
  #rightDiff;

  constructor(parent, movies, id) {
    this.#parent = parent;
    this.#movies = movies;
    this.#id = id;
    this.#leftDiff = 0;
    this.#rightDiff = 0;
  }

  render() {
    this.renderTemplate();
  }

  checkBtns() {
    const btnNext = document.getElementById('slider-btn-next');
    const btnPrev = document.getElementById('slider-btn-prev');

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

  renderTemplate() {
    this.#parent.insertAdjacentHTML('beforeend', template({ id: this.#id }));

    const container = document.querySelector('.slider__container');
    const track = document.getElementById(`slider-${this.#id}`);
    const btnNext = document.getElementById('slider-btn-next');
    const btnPrev = document.getElementById('slider-btn-prev');
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

    this.#movies.forEach((movie) => {
      const card = new Card(track, movie);
      card.render();
    });

    // Записываем разницу между track и container для скролла вправо
    this.#rightDiff = track.clientWidth - container.clientWidth;
    this.checkBtns();
  }
}
