import { Card } from '../Card/Card';

export class Slider {
  #parent;
  #movies;
  #id;
  #cardsToShow;
  #cardsToScroll;
  #position;

  constructor(parent, movies, id) {
    this.#parent = parent;
    this.#movies = movies;
    this.#id = id;
    this.#cardsToShow = 4;
    this.#cardsToScroll = 2;
    this.#position = 0;
  }

  render() {
    this.renderTemplate();
  }

  setPositon() {
    const sliderTrack = document.getElementById(`slider-${this.#id}`);
    sliderTrack.style.transform = `translateX(${this.#position}px)`;
  }

  checkBtns() {
    const btnNext = document.getElementById('slider-btn-next');
    const btnPrev = document.getElementById('slider-btn-prev');
    const container = document.querySelector('.slider__container');
    // const itemWidth = container.clientWidth / this.#cardsToShow;
    const itemWidth = 160;

    btnPrev.disabled = this.#position === 0;
    btnNext.disabled =
      this.#position <= -(this.#movies.length - this.#cardsToShow) * itemWidth;
  }

  renderTemplate() {
    const template = Handlebars.templates['Slider.hbs'];

    this.#parent.insertAdjacentHTML('beforeend', template({ id: this.#id }));

    const container = document.querySelector('.slider__container');
    const sliderTrack = document.getElementById(`slider-${this.#id}`);
    const btnNext = document.getElementById('slider-btn-next');
    const btnPrev = document.getElementById('slider-btn-prev');
    const itemsCount = this.#movies.length; // TODO: check
    // const itemWidth = container.clientWidth / this.#cardsToShow;
    const itemWidth = 160;
    const movePosition = this.#cardsToScroll * itemWidth;

    btnNext.addEventListener('click', () => {
      console.log('click next');
      const itemsLeft =
        itemsCount -
        (Math.abs(this.#position) + this.#cardsToShow * itemWidth) / itemWidth;

      this.#position -=
        itemsLeft >= this.#cardsToScroll ? movePosition : itemsLeft * itemWidth;

      this.setPositon();
      this.checkBtns();
    });

    btnPrev.addEventListener('click', () => {
      const itemsLeft = Math.abs(this.#position) / itemWidth;

      this.#position +=
        itemsLeft >= this.#cardsToScroll ? movePosition : itemsLeft * itemWidth;

      this.setPositon();
      this.checkBtns();
    });

    this.#movies.forEach((movie) => {
      const card = new Card(sliderTrack, movie);
      card.render();
    });

    const items = sliderTrack.querySelectorAll('.card');
    items.forEach((item) => {
      console.log(item);
      item.style.minWidth = `${itemWidth}px`;
    });
  }
}
