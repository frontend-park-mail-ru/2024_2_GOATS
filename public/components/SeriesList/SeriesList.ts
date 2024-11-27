import { Season, Episode } from 'types/movie';
import template from './SeriesList.hbs';
import { SeasonsMenu } from 'components/SeasonsMenu/SeasonsMenu';
import { SeriesListItem } from 'components/SeriesListItem/SeriesListItem';

export class SeriesList {
  #parent;
  #seasons;
  #currentSeason;
  #currentSeries;
  #selectedSeason;
  #onSeriesClick;

  constructor(params: {
    parent: HTMLElement;
    seasons: Season[];
    currentSeason: number;
    currentSeries: number;
    onSeriesClick: (seriesNumber: number, seasonNumber: number) => void;
  }) {
    this.#parent = params.parent;
    this.#seasons = params.seasons;
    this.#currentSeason = params.currentSeason;
    this.#currentSeries = params.currentSeries;
    this.#onSeriesClick = params.onSeriesClick;
    this.#selectedSeason = params.currentSeason;
  }

  render() {
    this.renderTemplate();
  }

  onSeasonClick(number: number) {
    if (number !== this.#currentSeason) {
      this.#currentSeason = number;
      this.renderSeasonsBlock();
      this.seriesKill();
      this.#selectedSeason++;
      this.render;
      this.renderSeries();
    }
  }

  renderSeasonsBlock() {
    const seasonsBlock = document.getElementById(
      'series-list-seasons',
    ) as HTMLDivElement;
    if (this.#seasons) {
      const seasonsMenu = new SeasonsMenu(
        seasonsBlock,
        this.#seasons.length,
        this.#currentSeason,
        2,
        this.onSeasonClick.bind(this),
      );
      seasonsMenu.render();
    }
  }

  renderSeriesListItem(series: Episode) {
    const seriesBlock = document.querySelector(
      '.series-list__series_items',
    ) as HTMLDivElement;
    const seriesListItem = new SeriesListItem({
      parent: seriesBlock,
      series: series,
      currentSeason: this.#currentSeason,
      currentSeries: this.#currentSeries,
      onSeriesListItemClick: this.#onSeriesClick,
    });
    seriesListItem.render();
  }

  renderSeries() {
    this.#seasons[this.#currentSeason - 1].episodes.forEach((series) => {
      this.renderSeriesListItem(series);
    });
  }

  seriesKill() {
    const seriesBlock = document.querySelector(
      '.series-list__series_items',
    ) as HTMLDivElement;
    seriesBlock.innerHTML = '';
  }

  getSeriesCaption() {
    const seriesCount = this.#seasons[this.#currentSeason - 1].episodes.length;
    let caption = String(seriesCount);
    if (seriesCount === 1) {
      caption += ' серия';
    } else if (seriesCount > 1 && seriesCount < 5) {
      caption += ' серий';
    } else {
      caption += ' серий';
    }
    return caption;
  }

  renderTemplate() {
    this.#parent.innerHTML = template({
      seasons: this.#seasons,
      seriesCaption: this.getSeriesCaption(),
    });
    this.renderSeasonsBlock();

    this.renderSeries();
  }
}
