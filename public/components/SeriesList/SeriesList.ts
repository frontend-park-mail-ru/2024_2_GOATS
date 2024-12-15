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
    if (number !== this.#selectedSeason) {
      this.#selectedSeason = number;
      this.renderSeasonsBlock();
      this.seriesKill();
      this.render;
      this.renderSeries();
    }
  }

  renderSeasonsBlock() {
    if (this.#seasons) {
      const seasonsBlock = document.getElementById(
        'series-list-seasons',
      ) as HTMLDivElement;
      const seasonsMenu = new SeasonsMenu(
        seasonsBlock,
        this.#seasons.length,
        this.#selectedSeason,
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
      selectedSeason: this.#selectedSeason,
      currentSeriesId:
        this.#seasons[this.#selectedSeason - 1].episodes[
          this.#currentSeries - 1
        ].id,
      onSeriesListItemClick: this.#onSeriesClick,
    });

    seriesListItem.render();
  }

  renderSeries() {
    this.#seasons[this.#selectedSeason - 1].episodes.forEach((series) => {
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
    const seriesCount = this.#seasons[this.#selectedSeason - 1].episodes.length;
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
