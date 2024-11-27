// import { Episode } from 'types/movie';
// import template from './SeriesListItem.hbs';

// export class SeriesListItem {
//   #parent;
//   #series;
//   #currentSeason;
//   #currentSeries;
//   #onSeriesListItemClick;

//   constructor(params: {
//     parent: HTMLElement;
//     series: Episode;
//     currentSeason: number;
//     onSeriesListItemClick: (seriesNumber: number, seasonNumber: number) => void;
//   }) {
//     this.#parent = params.parent;
//     this.#series = params.series;
//     this.#currentSeason = params.currentSeason;
//     this.#currentSeries = params.seasin;
//     this.#onSeriesListItemClick = params.onSeriesListItemClick;
//   }

//   onSeriesClick() {
//     const currentSeriesListItem = document.getElementById(
//       `series-list-item-${this.#series.id}`,
//     );

//     currentSeriesListItem?.addEventListener('click', () => {
//       this.#onSeriesListItemClick(
//         this.#series.episodeNumber,
//         this.#currentSeason,
//       );
//     });
//   }

//   render() {
//     this.renderTemplate();
//   }

//   renderTemplate() {
//     this.#parent.insertAdjacentHTML(
//       'beforeend',
//       template({ series: this.#series }),
//     );

//     this.onSeriesClick();
//   }
// }
