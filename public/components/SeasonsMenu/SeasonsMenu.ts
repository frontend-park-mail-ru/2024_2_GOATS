import template from './SeasonsMenu.hbs';
import { SeasonsNumber } from 'types/movie';

export class SeasonsMenu {
  #parent;
  #seasonsCount;
  #activeSeason;
  #onSeasonClick;
  #seasons: SeasonsNumber[] = [];
  #menuId;

  constructor(
    parent: HTMLElement,
    seasonsCount: number,
    activeSeason: number,
    menuId: number,
    onSeasonClick: (number: number) => void,
  ) {
    this.#parent = parent;
    this.#seasonsCount = seasonsCount;
    this.#activeSeason = activeSeason;
    this.#menuId = menuId;
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
        `season-${this.#menuId}-${season.number}`,
      ) as HTMLDivElement;

      currentSeason.addEventListener('click', () => {
        this.#onSeasonClick(season.number);
      });
    });
  }

  renderTemplate() {
    this.getSeasonsArray();

    const seasonsWithKey = this.#seasons.map((season) => {
      return { ...season, key: this.#menuId };
    });

    this.#parent.innerHTML = template({
      id: this.#menuId,
      seasons: seasonsWithKey,
    });
    this.onSeasonClick();
  }
}
