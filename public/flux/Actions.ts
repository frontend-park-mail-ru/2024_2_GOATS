import { User, AuthUser, UserData } from 'types/user';
import { ActionTypes } from './ActionTypes';
import { dispatcher } from './Dispatcher';

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
  renderMoviePage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_MOVIE_PAGE,
    });
  },
  renderHeader(url: string) {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_HEADER,
      payload: url,
    });
  },
  renderActorPage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_ACTOR_PAGE,
    });
  },
  renderProfilePage() {
    dispatcher.dispatch({
      type: ActionTypes.RENDER_PROFILE_PAGE,
    });
  },
  renderRoomPage() {
    console.log('ACTION RENDER ROOM PAGE');
    dispatcher.dispatch({
      type: ActionTypes.RENDER_ROOM_PAGE,
    });
  },
  getUser() {
    dispatcher.dispatch({
      type: ActionTypes.GET_USER,
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
};
