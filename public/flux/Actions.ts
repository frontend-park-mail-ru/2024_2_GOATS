import { User, AuthUser, UserData, Subscription } from 'types/user';
import { ActionTypes } from './ActionTypes';
import { dispatcher } from './Dispatcher';
import { Action } from 'types/room';
import { MovieSaved } from 'types/movie';

export const Actions = {
  renderMainPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_MAIN_PAGE,
    });
  },
  renderAuthPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_AUTH_PAGE,
    });
  },
  renderRegPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_REG_PAGE,
    });
  },
  renderMoviePage(
    id: number | string,
    fromRecentlyWatched?: boolean,
    receivedSeason?: boolean,
    receivedSeries?: boolean,
  ) {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_MOVIE_PAGE,
      payload: { id, fromRecentlyWatched, receivedSeason, receivedSeries },
    });
  },
  renderHeader(url: string) {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_HEADER,
      payload: url,
    });
  },
  renderActorPage(id: number | string) {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_ACTOR_PAGE,
      payload: id,
    });
  },
  renderProfilePage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_PROFILE_PAGE,
    });
  },
  renderRoomPage(id: number | string) {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_ROOM_PAGE,
      payload: id,
    });
  },
  renderGenresPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_GENRES_PAGE,
    });
  },
  renderSearchBlock() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_SEARCH_BLOCK,
    });
  },
  renderFavoritesPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_FAVORITES_PAGE,
    });
  },
  getUser() {
    dispatcher.dispatch({
      type: ActionTypes.GET_USER,
    });
  },
  getCsrf() {
    dispatcher.dispatch({
      type: ActionTypes.GET_CSRF,
    });
  },
  auth(authData: AuthUser) {
    dispatcher.dispatch({
      type: ActionTypes.AUTH,
      authData,
    });
  },
  register(registrationData: AuthUser) {
    dispatcher.dispatch({
      type: ActionTypes.REGISTER,
      registrationData,
    });
  },
  changeUserInfo(userData: UserData) {
    dispatcher.dispatch({
      type: ActionTypes.CHANGE_USER_INFO,
      userData,
    });
  },
  changePassword(passwordChangeData: {
    prevPasswordValue: string;
    newPasswordValue: string;
    newPasswordComfirmValue: string;
  }) {
    dispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD,
      passwordChangeData,
    });
  },
  getMovie(id: number | string) {
    dispatcher.dispatch({
      type: ActionTypes.GET_MOVIE,
      payload: id,
    });
  },
  createRoom(movieId: number) {
    dispatcher.dispatch({
      type: ActionTypes.CREATE_ROOM,
      movieId,
    });
  },
  sendActionMessage(actionData: Action) {
    dispatcher.dispatch({
      type: ActionTypes.SEND_ACTION_MESSAGE,
      actionData,
    });
  },
  getLastMovies() {
    dispatcher.dispatch({
      type: ActionTypes.GET_LAST_MOVIES,
    });
  },
  setLastMovies(
    timeCode: number,
    duration: number,
    season?: number,
    series?: number,
  ) {
    dispatcher.dispatch({
      type: ActionTypes.SET_LAST_MOVIES,
      payload: {
        timeCode,
        duration,
        season,
        series,
      },
    });
  },
  copyLastMovies() {
    dispatcher.dispatch({
      type: ActionTypes.COPY_LAST_MOVIES,
    });
  },
  deleteLastMovie() {
    dispatcher.dispatch({
      type: ActionTypes.DELETE_LAST_MOVIE,
    });
  },
  addToFavorites(id: number) {
    dispatcher.dispatch({
      type: ActionTypes.ADD_TO_FAVORITES,
      id,
    });
  },
  deleteFromFavorites(id: number) {
    dispatcher.dispatch({
      type: ActionTypes.DELETE_FROM_FAVORITES,
      id,
    });
  },
  buySubscription(subscriptionFields: Subscription) {
    dispatcher.dispatch({
      type: ActionTypes.BUY_SUBSCRIPTION,
      subscriptionFields,
    });
  },
  rateMovie(rating: number) {
    dispatcher.dispatch({
      type: ActionTypes.RATE_MOVIE,
      payload: { rating },
    });
  },
  deleteRating() {
    dispatcher.dispatch({
      type: ActionTypes.DELETE_RATING,
    });
  },
  setGlobalRoomId(id: string) {
    dispatcher.dispatch({
      type: ActionTypes.SET_GLOBAL_ROOM_ID,
      id,
    });
  },
  changeMovie(id: number) {
    dispatcher.dispatch({
      type: ActionTypes.CHANGE_MOVIE,
      id,
    });
  },
};
