//Типы для теста поиска, пока данные приходят в очень непонятном виде
export type findActors = {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    name: string;
  };
};

export type findMovies = {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    title: string;
  };
};
