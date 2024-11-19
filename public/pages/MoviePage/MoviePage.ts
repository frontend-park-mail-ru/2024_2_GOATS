import template from './MoviePage.hbs';
import { MovieDetailed, MovieSaved } from 'types/movie';
import { moviePageStore } from 'store/MoviePageStore';
import { MovieDescription } from 'components/MovieDescription/MovieDescription';
import { Slider } from 'components/Slider/Slider';
import { mockSeries } from '../../consts';
import { roomPageStore } from 'store/RoomPageStore';
import { SeasonsMenu } from 'components/SeasonsMenu/SeasonsMenu';
import { Actions } from 'flux/Actions';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { HOST } from '../../consts';

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

  render(fromRecentlyWatched?: boolean) {
    this.#currentSeason = 1;
    this.#currentSeries = 1;
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
    if (this.#movie?.seasons) {
      this.renderVideoPlayer(
        this.#movie?.seasons[this.#currentSeason - 1].episodes[seriesNumber - 1]
          .video,
      );
    }
  }

  renderSeriesSlider() {
    if (this.#movie?.seasons) {
      this.#movie.seasons.map((season) => {
        return season.episodes.map((episode, index) => {
          episode.preview = mockSeries[index].image;
          episode.video = HOST + mockSeries[index].video;
          return episode;
        });
      });
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

    const video = new VideoPlayer({
      parent: videoContainer,
      url: videoUrl,
      hasNextSeries: !!(
        this.#movie?.seasons &&
        this.#currentSeries <
          this.#movie.seasons[this.#currentSeason - 1].episodes.length
      ),
      hasPrevSeries: !!(this.#movie?.seasons && this.#currentSeries > 1),
      startTimeCode: this.#startTimeCode,
      onBackClick: this.onBackClick.bind(this),
      onNextButtonClick: this.onNextSeriesClick.bind(this),
      onPrevButtonClick: this.onPrevSeriesClick.bind(this),
      handleSaveTimecode: this.handleSaveTimecode.bind(this),
    });
    video.render();
    videoContainer.style.zIndex = '10';
  }

  onBackClick() {
    this.#isModalOpened = false;
    const videoContainer = document.getElementById(
      'video-container',
    ) as HTMLElement;

    videoContainer.innerHTML = '';
    videoContainer.style.zIndex = '-1';

    if (this.#movie) {
      Actions.getLastMovies();
      this.setStartTimecode();
    }
  }

  setStartTimecode() {
    const foundSavedMovie = moviePageStore
      .getLastMovies()
      .find((movie: MovieSaved) => {
        return movie.id === this.#movie?.id;
      });

    if (foundSavedMovie) {
      this.#startTimeCode = foundSavedMovie.timeCode;
    } else {
      this.#startTimeCode = 0;
    }
  }

  rerenderVideo() {
    if (this.#movie?.seasons) {
      this.renderVideoPlayer(
        this.#movie?.seasons[this.#currentSeason - 1].episodes[
          this.#currentSeries - 1
        ].video,
      );
    }
  }
  onNextSeriesClick() {
    this.#currentSeries++;
    this.rerenderVideo();
  }

  onPrevSeriesClick() {
    this.#currentSeries--;
    this.rerenderVideo();
  }

  handleSaveTimecode(timeCode: number, duration: number) {
    if (timeCode > duration * 0.95 || timeCode < duration * 0.05) {
      Actions.deleteLastMovie();
      return;
    }

    Actions.setLastMovies(timeCode, duration);
  }

  onWatchClick() {
    if (!this.#movie?.isSerial && this.#movie) {
      this.renderVideoPlayer(this.#movie?.video);
    } else if (this.#movie && this.#movie.seasons) {
      this.renderVideoPlayer(this.#movie.seasons[0].episodes[0].video);
    }
  }

  renderBlocks() {
    const movieDescriptionContainer = document.getElementById(
      'movie-description-container',
    ) as HTMLElement;

    const movieDescription = new MovieDescription(
      movieDescriptionContainer,
      this.onWatchClick.bind(this),
    );

    if (this.#movie?.seasons) {
      this.renderSeasonsBlock(false);
    }
    if (movieDescription) {
      movieDescription.render();
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
    this.setStartTimecode();
    const pageElement = document.getElementsByTagName('main')[0];
    window.scrollTo(0, 0);

    pageElement.innerHTML = template({
      longDescription: this.#movie?.longDescription,
    });
    this.renderBlocks();
    this.checkWs();

    if (this.#movie && this.#fromRecentlyWatched) {
      this.renderVideoPlayer(this.#movie.video);
    }
  }
}
