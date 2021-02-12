import { stopSubmit } from 'redux-form';
import { profileAPI } from '../api/api';
import { PostType,ProfileType,PhotosType } from '../types/types';

const ADD_POST = 'ADD_POST';
const DELETE_POST = 'DELETE_POST';
const SAVE_PHOTO_SUCCESS = 'SAVE_PHOTO_SUCCESS';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_STATUS = 'SET_STATUS';



let initialState = {
  posts: [
    {
      text: "Hi,it's my first post",
      id: 1,
      likesCount: 11,
      img:
        'https://i.pinimg.com/originals/80/e5/0d/80e50d775e936217f89af2de58ba7646.jpg',
    },
    {
      text: "It's cool",
      id: 2,
      likesCount: 12,
      img:
        'https://i.pinimg.com/originals/53/f9/8a/53f98a6b76f60356b2b4c261963377e6.jpg',
    },
  ] as Array<PostType>,
  profile: null as ProfileType | null,
  status: '' as string,
};
type InitialStateType = typeof initialState;
const profileReducer = (
  state = initialState,
  action: any,
): InitialStateType => {
  switch (action.type) {
    case ADD_POST: {
      let newPost = {
        text: action.newPostText,
        id: 3,
        likesCount: 11,
        img:
          'https://i.pinimg.com/originals/80/e5/0d/80e50d775e936217f89af2de58ba7646.jpg',
      };
      return {
        ...state,
        posts: [...state.posts, newPost],
      };
    }
    case DELETE_POST: {
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.idPost),
      };
    }
    case SET_USER_PROFILE: {
      return { ...state, profile: action.userProfile };
    }
    case SET_STATUS: {
      return { ...state, status: action.status };
    }
    case SAVE_PHOTO_SUCCESS: {
      return { ...state, profile: { ...state.profile, photos: action.photos } as ProfileType };
    }
    default: {
      return state;
    }
  }
};
type AddPostActionType = {
  type: typeof ADD_POST;
  newPostText: string;
};
type DeletePostActionType = { type: typeof DELETE_POST; idPost: number };
type SetUserProfileActionType = {
  type: typeof SET_USER_PROFILE;
  userProfile: ProfileType;
};
type SetStatusActionType = { type: typeof SET_STATUS; status: string };
type SavePhotoSuccessActionType = {
  type: typeof SAVE_PHOTO_SUCCESS;
  photos: PhotosType;
};
export const addPost = (newPostText: string): AddPostActionType => ({
  type: ADD_POST,
  newPostText,
});
export const deletePost = (idPost: number): DeletePostActionType => ({
  type: DELETE_POST,
  idPost,
});

export const setUserProfile = (
  userProfile: ProfileType,
): SetUserProfileActionType => {
  return {
    type: SET_USER_PROFILE,
    userProfile,
  };
};
export const setStatus = (status: string): SetStatusActionType => {
  return {
    type: SET_STATUS,
    status,
  };
};
const savePhotoSuccess = (photos: PhotosType): SavePhotoSuccessActionType => ({
  type: SAVE_PHOTO_SUCCESS,
  photos,
});
export let getUserProfile = (userId: number) => {
  return async (dispatch: any) => {
    let data = await profileAPI.getProfile(userId);
    dispatch(setUserProfile(data));
  };
};
export let getStatus = (userId: number) => {
  return async (dispatch: any) => {
    let data = await profileAPI.getStatus(userId);
    dispatch(setStatus(data));
  };
};
export let updateStatus = (status: string) => {
  return async (dispatch: any) => {
    let data = await profileAPI.updateStatus(status);
    if (data.resultCode === 0) {
      dispatch(setStatus(status));
    }
  };
};
export let savePhoto = (file: any) => {
  return async (dispatch: any) => {
    let data = await profileAPI.savePhoto(file);
    if (data.resultCode === 0) {
      dispatch(savePhotoSuccess(data.data.photos));
    }
  };
};
export let saveProfile = (profile: ProfileType) => {
  return async (dispatch: any, getState: any) => {
    const userId = getState().auth.userId;
    let data = await profileAPI.saveProfile(profile);
    if (data.resultCode === 0) {
      dispatch(getUserProfile(userId));
    } else {
      dispatch(
        stopSubmit('editProfile', {
          _error: data.messages[0],
        }),
      );
    }
  };
};

export default profileReducer;