export const deserializeSavedMovie = (savedMovie: any) => {
  return {
    id: savedMovie.id,
    title: savedMovie.title,
    album_url: savedMovie.albumImage,
    timecode: savedMovie.timeCode,
    duration: savedMovie.duration,
    saving_seconds: savedMovie.savingSeconds,
    ...(savedMovie.season && { season: savedMovie.season }),
    ...(savedMovie.series && { series: savedMovie.series }),
  };
};

export const deserializeSavedMovies = (savedMovies: any) => {
  return savedMovies.map((savedMovie: any) => {
    return deserializeSavedMovie(savedMovie);
  });
};
