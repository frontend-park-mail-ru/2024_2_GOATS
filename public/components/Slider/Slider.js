import { Card } from '../Card/Card';

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
    const template = Handlebars.templates['Slider.hbs'];

    this.#parent.insertAdjacentHTML('beforeend', template({ id: this.#id }));

    const container = document.querySelector('.slider__container');
    const track = document.getElementById(`slider-${this.#id}`);
    const btnNext = document.getElementById('slider-btn-next');
    const btnPrev = document.getElementById('slider-btn-prev');

    btnNext.addEventListener('click', () => {
      const track = document.getElementById(`slider-${this.#id}`);

      // Проверяем, на сколько пикселей нужно двигать (на всю ширину блока или на остаток)
      if (this.#rightDiff >= container.clientWidth) {
        track.style.transform = `translateX(-${
          this.#leftDiff + container.clientWidth
        }px)`;

        // Двигаем левую и правую границу
        this.#rightDiff -= container.clientWidth;
        this.#leftDiff += container.clientWidth;
      } else {
        track.style.transform = `translateX(-${
          this.#leftDiff + this.#rightDiff
        }px)`;
        this.#leftDiff += this.#rightDiff;
        this.#rightDiff = 0;
        console.log(this.#rightDiff, this.#leftDiff);
      }

      this.checkBtns();
    });

    btnPrev.addEventListener('click', () => {
      const track = document.getElementById(`slider-${this.#id}`);

      if (this.#leftDiff >= container.clientWidth) {
        track.style.transform = `translateX(-${
          this.#leftDiff - container.clientWidth
        }px)`;
        this.#rightDiff += container.clientWidth;
        this.#leftDiff -= container.clientWidth;
      } else {
        track.style.transform = `translateX(0px)`;
        this.#rightDiff += this.#leftDiff;
        this.#leftDiff = 0;
        console.log(this.#rightDiff, this.#leftDiff);
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
