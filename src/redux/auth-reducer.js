import { stopSubmit } from 'redux-form';
import { authAPI } from '../api/api';

const SET_AUTH_USER_DATA = 'SET_AUTH_USER_DATA';

let initialState = {
  userId: null,
  email: null,
  login: null,
  isAuth: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_USER_DATA: {
      return {
        ...state,
        ...action.data,
      };
    }
    default: {
      return state;
    }
  }
};
export const setAuthUserData = (email, userId, login, isAuth) => {
  return { type: SET_AUTH_USER_DATA, data: { userId, email, login, isAuth } };
};
export const getAuthUserData = () => (dispatch) => {
  authAPI.me().then((data) => {
    if (data.resultCode === 0) {
      let { email, id, login } = data.data;
      dispatch(setAuthUserData(email, id, login, true));
    }
  });
};
export const login = (email, password, rememberMe) => (dispatch) => {
  authAPI.login(email, password, rememberMe).then((data) => {
    if (data.resultCode === 0) {
      dispatch(getAuthUserData());
    } else {
      let messageError =
        data.messages.length > 0 ? data.messages[0] : 'some error';
      dispatch(
        stopSubmit('login', {
          _error: messageError,
        }),
      );
    }
  });
};

export const logout = () => (dispatch) => {
  authAPI.logout().then((data) => {
    if (data.resultCode === 0) {
      dispatch(setAuthUserData(null, null, null, false));
    }
  });
};

export default authReducer;
