import { Episode } from 'types/movie';
import template from './SeriesListItem.hbs';

export class SeriesListItem {
  #parent;
  #series;
  #currentSeason;
  #selectedSeason;
  #currentSeriesId;
  #onSeriesListItemClick;

  constructor(params: {
    parent: HTMLElement;
    series: Episode;
    currentSeason: number;
    selectedSeason: number;
    currentSeriesId: number;
    onSeriesListItemClick: (seriesNumber: number, seasonNumber: number) => void;
  }) {
    this.#parent = params.parent;
    this.#series = params.series;
    this.#currentSeason = params.currentSeason;
    this.#selectedSeason = params.selectedSeason;
    this.#currentSeriesId = params.currentSeriesId;
    this.#onSeriesListItemClick = params.onSeriesListItemClick;
  }

  onSeriesClick() {
    const currentSeriesListItem = document.getElementById(
      `series-list-item-${this.#series.id}`,
    );

    currentSeriesListItem?.addEventListener('click', () => {
      this.#onSeriesListItemClick(
        this.#series.episodeNumber,
        this.#selectedSeason,
      );
    });
  }

  render() {
    this.renderTemplate();
  }

  renderTemplate() {
    this.#parent.insertAdjacentHTML(
      'beforeend',
      template({
        series: this.#series,
        isCurrentSeries:
          this.#series.id === this.#currentSeriesId &&
          this.#selectedSeason === this.#currentSeason,
      }),
    );

    this.onSeriesClick();
  }
}
