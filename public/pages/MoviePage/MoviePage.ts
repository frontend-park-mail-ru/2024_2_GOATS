import template from './MoviePage.hbs';
import { MovieDetailed, MovieSaved } from 'types/movie';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDescription } from 'components/MovieDescription/MovieDescription';
import { Slider } from 'components/Slider/Slider';
import { roomPageStore } from 'store/RoomPageStore';
import { SeasonsMenu } from 'components/SeasonsMenu/SeasonsMenu';
import { Actions } from 'flux/Actions';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { RateBlock } from 'components/RateBlock/RateBlock';

export class MoviePage {
  #movie!: MovieDetailed | null;
  #fromRecentlyWatched = false;
  #currentSeason!: number;
  #currentSeries!: number;
  #seriesSlider!: Slider;
  #isModalOpened;
  #startTimeCode = 0;

  constructor() {
    this.#isModalOpened = false;
  }

  render(
    fromRecentlyWatched?: boolean,
    receivedSeason?: number,
    receivedSeries?: number,
  ) {
    if (!fromRecentlyWatched) {
      this.#currentSeason = 1;
      this.#currentSeries = 1;
    } else if (receivedSeason && receivedSeries) {
      this.#currentSeason = receivedSeason;
      this.#currentSeries = receivedSeries;
    }

    this.#movie = moviePageStore.getMovie();
    this.#fromRecentlyWatched = !!fromRecentlyWatched;
    this.renderTemplate();
  }

  checkWs() {
    if (roomPageStore.getWs()) {
      roomPageStore.closeWs();
    }
  }

  onSeasonClick(number: number) {
    if (number !== this.#currentSeason) {
      this.#currentSeason = number;
      this.renderSeasonsBlock(true);
      this.#seriesSlider.kill();
      this.renderSeriesSlider();
    }
  }

  renderSeasonsBlock(onlySeasons: boolean) {
    const seasonsBlock = document.getElementById(
      'movie-page-seasons',
    ) as HTMLDivElement;
    if (this.#movie?.seasons) {
      const seasonsMenu = new SeasonsMenu(
        seasonsBlock,
        this.#movie?.seasons.length,
        this.#currentSeason,
        1,
        this.onSeasonClick.bind(this),
      );
      seasonsMenu.render();

      if (!onlySeasons) {
        this.renderSeriesSlider();
      }
    }
  }

  onSeriesClick(seriesNumber: number) {
    this.#currentSeries = seriesNumber;

    this.setSeriesStartTimecode();

    if (this.#movie?.seasons) {
      this.renderVideoPlayer(
        this.#movie?.seasons[this.#currentSeason - 1].episodes[seriesNumber - 1]
          .video,
      );
    }
  }

  renderSeriesSlider() {
    if (this.#movie?.seasons) {
      const seriesBlock = document.getElementById(
        'movie-page-series',
      ) as HTMLElement;
      this.#seriesSlider = new Slider({
        parent: seriesBlock,
        id: 99,
        type: 'series',
        series: this.#movie?.seasons[this.#currentSeason - 1].episodes,
        onSeriesClick: this.onSeriesClick.bind(this),
      });
      this.#seriesSlider.render();
    }
  }

  renderVideoPlayer(videoUrl: string) {
    this.#isModalOpened = true;
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;
    let allSeriesCount = 0;
    if (this.#movie?.isSerial) {
      this.#movie?.seasons?.forEach((season) => {
        season.episodes.forEach(() => {
          allSeriesCount++;
        });
      });
    }

    if (this.#movie) {
      const video = new VideoPlayer({
        parent: videoContainer,
        videoUrl,
        titleImage: this.#movie.titleImage,
        ...(this.#movie.isSerial && { currentSeason: this.#currentSeason }),
        ...(this.#movie.isSerial && { currentSeries: this.#currentSeries }),
        startTimeCode: this.#startTimeCode,
        ...(this.#movie.isSerial && { seasons: this.#movie.seasons }),
        onBackClick: this.onBackClick.bind(this),
        onVideoUpdate: this.rerenderVideo.bind(this),
        handleSaveTimecode: this.handleSaveTimecode.bind(this),
        autoPlay: true,
        ...(this.#movie.isSerial && {
          onSeriesClick: () => (this.#startTimeCode = 0),
        }),
      });
      video.render();
      videoContainer.style.zIndex = '10';
    }
  }

  onBackClick() {
    this.#isModalOpened = false;
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;

    videoContainer.innerHTML = '';
    videoContainer.style.zIndex = '-1';

    this.#currentSeason = 1;
    this.#currentSeries = 1;

    if (this.#movie) {
      Actions.getLastMovies();
      this.setStartTimecode();
    }

    this.renderSeasonsBlock(false);
  }

  setStartTimecode() {
    const foundSavedMovie = moviePageStore
      .getLastMovies()
      .find((movie: MovieSaved) => {
        return movie.id === this.#movie?.id;
      });

    if (foundSavedMovie && !foundSavedMovie.season) {
      this.#startTimeCode = foundSavedMovie.timeCode;
    } else {
      this.#startTimeCode = 0;
    }
  }

  setSeriesStartTimecode() {
    const foundSavedMovie = moviePageStore
      .getLastMovies()
      .find((movie: MovieSaved) => {
        return movie.id === this.#movie?.id;
      });
    if (foundSavedMovie) {
      if (
        this.#currentSeason === foundSavedMovie.season &&
        this.#currentSeries === foundSavedMovie.series
      ) {
        this.#startTimeCode = foundSavedMovie.timeCode;
      } else {
        this.#startTimeCode = 0;
      }
    } else {
      this.#startTimeCode = 0;
    }
  }

  rerenderVideo(
    videoUrl: string,
    currentSeason: number,
    currentSeries: number,
  ) {
    this.#currentSeason = currentSeason;
    this.#currentSeries = currentSeries;
    this.renderVideoPlayer(videoUrl);
  }

  handleSaveTimecode(
    timeCode: number,
    duration: number,
    season?: number,
    series?: number,
  ) {
    if (timeCode > duration * 0.95 || timeCode < duration * 0.05) {
      Actions.deleteLastMovie();
      return;
    }

    if (!this.#movie?.isSerial) {
      Actions.setLastMovies(timeCode, duration);
    } else {
      Actions.setLastMovies(timeCode, duration, season, series);
    }
  }

  onWatchClick() {
    if (!this.#movie?.isSerial && this.#movie) {
      this.renderVideoPlayer(this.#movie?.video);
    } else if (this.#movie && this.#movie.seasons) {
      const currentSavedMovie = moviePageStore
        .getLastMovies()
        .find((movie) => movie.id === this.#movie?.id);
      if (!currentSavedMovie) {
        this.renderVideoPlayer(this.#movie.seasons[0].episodes[0].video);
      } else {
        this.#currentSeason = currentSavedMovie.season as number;
        this.#currentSeries = currentSavedMovie.series as number;
        this.#startTimeCode = currentSavedMovie.timeCode;
        this.renderVideoPlayer(
          this.#movie.seasons[(currentSavedMovie.season as number) - 1]
            .episodes[(currentSavedMovie.series as number) - 1].video,
        );
      }
    }
  }

  renderMovieDescription() {
    const movieDescriptionContainer = document.getElementById(
      'movie-description-container',
    ) as HTMLElement;

    const movieDescription = new MovieDescription(
      movieDescriptionContainer,
      this.onWatchClick.bind(this),
    );

    if (movieDescription) {
      movieDescription.render();
    }
  }

  renderRateBlock() {
    const rateBlockContainer = document.getElementById(
      'movie-page-rating-block',
    ) as HTMLElement;
    const rateBlock = new RateBlock(rateBlockContainer);
    if (rateBlock) {
      rateBlock.render();
    }
  }

  renderBlocks() {
    this.renderMovieDescription();
    this.renderRateBlock();
    if (this.#movie?.seasons) {
      this.renderSeasonsBlock(false);
    }

    const personsBlock = document.getElementById(
      'movie-page-persons',
    ) as HTMLElement;
    if (this.#movie && this.#movie.actors?.length) {
      const personsSlider = new Slider({
        parent: personsBlock,
        id: 1,
        type: 'actors',
        persons: this.#movie.actors,
      });
      personsSlider.render();
    } else {
      const newBlock = document.createElement('div');
      const slider = new Slider({
        parent: newBlock,
        id: 1,
        type: 'actors',
      });
      slider.render();

      const descriptionSkeleton = document.createElement('div');
      descriptionSkeleton.classList.add('movie-page-skeleton__description');

      const descriptionTitleSkeleton = document.createElement('div');
      descriptionTitleSkeleton.classList.add('skeleton__text');

      const descriptionTextSkeleton = document.createElement('div');
      descriptionTextSkeleton.classList.add(
        'movie-page-skeleton__description_text',
        'skeleton__text',
      );

      descriptionSkeleton.appendChild(descriptionTitleSkeleton);
      descriptionSkeleton.appendChild(descriptionTextSkeleton);

      const movieDescription = document.querySelector(
        '.movie-page__description',
      ) as HTMLDivElement;
      movieDescription.innerHTML = descriptionSkeleton.outerHTML;
    }
  }

  renderTemplate() {
    if (!this.#movie?.isSerial) {
      this.setStartTimecode();
    } else {
      this.setSeriesStartTimecode();
    }
    const rootElem = document.getElementById('root');
    if (rootElem) {
      rootElem.classList.add('root-black');
      rootElem.classList.remove('root-image');
    }
    const pageElement = document.getElementsByTagName('main')[0];
    window.scrollTo(0, 0);

    pageElement.innerHTML = template({
      longDescription: this.#movie?.longDescription,
    });
    this.renderBlocks();
    this.checkWs();

    if (this.#movie && this.#fromRecentlyWatched) {
      if (!this.#movie.isSerial) {
        this.renderVideoPlayer(this.#movie.video);
      } else if (this.#movie.seasons) {
        this.renderVideoPlayer(
          this.#movie.seasons
            .find((season) => season.seasonNumber === this.#currentSeason)
            ?.episodes.find(
              (series) => series.episodeNumber === this.#currentSeries,
            )?.video as string,
        );
      }
    }
  }
}
