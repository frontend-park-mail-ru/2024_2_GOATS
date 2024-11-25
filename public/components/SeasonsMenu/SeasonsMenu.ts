import template from './SeasonsMenu.hbs';
import { SeasonsNumber } from 'types/movie';

export class SeasonsMenu {
  #parent;
  #seasonsCount;
  #activeSeason;
  #onSeasonClick;
  #seasons: SeasonsNumber[] = [];

  constructor(
    parent: HTMLElement,
    seasonsCount: number,
    activeSeason: number,
    onSeasonClick: (number: number) => void,
  ) {
    this.#parent = parent;
    this.#seasonsCount = seasonsCount;
    this.#activeSeason = activeSeason;
    this.#onSeasonClick = onSeasonClick;
  }

  render() {
    this.renderTemplate();
  }

  getSeasonsArray() {
    const seasons = [];
    for (let i = 0; i < this.#seasonsCount; ++i) {
      seasons.push({ number: i + 1, isActive: false });
    }

    seasons[this.#activeSeason - 1].isActive = true;
    this.#seasons = seasons;
  }

  onSeasonClick() {
    let currentSeason;
    this.#seasons.forEach((season) => {
      currentSeason = document.getElementById(
        `season-${season.number}`,
      ) as HTMLDivElement;

      currentSeason.addEventListener('click', () =>
        this.#onSeasonClick(season.number),
      );
    });
  }

  renderTemplate() {
    this.getSeasonsArray();
    this.#parent.innerHTML = template({ seasons: this.#seasons });
    this.onSeasonClick();
  }
}
