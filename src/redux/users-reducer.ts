import { usersAPI } from '../api/api';
import { UserType } from '../types/types';
import { AppStateType } from './redux-store';
import { ThunkAction } from 'redux-thunk';

const TOGGLE_FOLLOW = 'TOGGLE-FOLLOW';
const SET_USERS = 'SET-USERS';
const SET_CURRENT_PAGE = 'SET-CURRENT-PAGE';
const SET_TOTAL_USERS_COUNT = 'SET-TOTAL-USERS-COUNT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_FOLLOWING_PROGRESS = 'TOGGLE_IS_FOLLOWING_PROGRESS';

let initialState = {
  users: [] as Array<UserType>,
  pageSize: 10,
  totalUsersCount: 250,
  currentPage: 1,
  isFetching: false,
  followingInProgress: [] as Array<number>,
};
type InitialStateType = typeof initialState;
const usersReducer = (
  state = initialState,
  action: ActionsTypes,
): InitialStateType => {
  switch (action.type) {
    case TOGGLE_FOLLOW: {
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id === action.userId) {
            return { ...user, followed: !user.followed };
          }
          return user;
        }),
      };
    }
    case SET_USERS: {
      return {
        ...state,
        users: action.users,
      };
    }
    case SET_CURRENT_PAGE: {
      return {
        ...state,
        currentPage: action.pageNumber,
      };
    }
    case SET_TOTAL_USERS_COUNT: {
      return {
        ...state,
        totalUsersCount: action.totalUsersCount,
      };
    }
    case TOGGLE_IS_FETCHING: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    case TOGGLE_IS_FOLLOWING_PROGRESS: {
      return {
        ...state,
        followingInProgress: action.isFetching
          ? [...state.followingInProgress, action.userId]
          : state.followingInProgress.filter((id) => id !== action.userId),
      };
    }

    default: {
      return state;
    }
  }
};
type ActionsTypes =
  | ToggleFollowActionType
  | SetUsersActionType
  | SetCurrentPageActionType
  | SetTotalUsersCountActionType
  | ToggleIsFetchingActionType
  | ToggleFollowingProgressActionType;

type ToggleFollowActionType = {
  type: typeof TOGGLE_FOLLOW;
  userId: number;
};

export const toggleFollow = (userId: number): ToggleFollowActionType => {
  return { type: TOGGLE_FOLLOW, userId };
};
type SetUsersActionType = {
  type: typeof SET_USERS;
  users: Array<UserType>;
};
export const setUsers = (users: Array<UserType>): SetUsersActionType => {
  return { type: SET_USERS, users };
};
type SetCurrentPageActionType = {
  type: typeof SET_CURRENT_PAGE;
  pageNumber: number;
};
export const setCurrentPage = (
  pageNumber: number = 1,
): SetCurrentPageActionType => {
  return { type: SET_CURRENT_PAGE, pageNumber };
};
type SetTotalUsersCountActionType = {
  type: typeof SET_TOTAL_USERS_COUNT;
  totalUsersCount: number;
};
export const setTotalUsersCount = (
  totalUsersCount: number,
): SetTotalUsersCountActionType => {
  return { type: SET_TOTAL_USERS_COUNT, totalUsersCount };
};
type ToggleIsFetchingActionType = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};
export const toggleIsFetching = (
  isFetching: boolean,
): ToggleIsFetchingActionType => {
  return { type: TOGGLE_IS_FETCHING, isFetching };
};
type ToggleFollowingProgressActionType = {
  type: typeof TOGGLE_IS_FOLLOWING_PROGRESS;
  isFetching: boolean;
  userId: number;
};
export const toggleFollowingProgress = (
  isFetching: boolean,
  userId: number,
): ToggleFollowingProgressActionType => {
  return { type: TOGGLE_IS_FOLLOWING_PROGRESS, isFetching, userId };
};

type ThunkType = ThunkAction<
  Promise<void>,
  AppStateType,
  unknown,
  ActionsTypes
>;

export let follow = (userId: number): ThunkType => {
  return async (dispatch) => {
    dispatch(toggleFollowingProgress(true, userId));
    let data = await usersAPI.followUser(userId);
    dispatch(toggleFollowingProgress(false, userId));
    if (data.resultCode === 0) {
      dispatch(toggleFollow(userId));
    }
  };
};
export let unfollow = (userId: number): ThunkType => {
  return async (dispatch) => {
    dispatch(toggleFollowingProgress(true, userId));
    let data = await usersAPI.unfollowUser(userId);
    dispatch(toggleFollowingProgress(false, userId));
    if (data.resultCode === 0) {
      dispatch(toggleFollow(userId));
    }
  };
};

export let requestUsers = (
  currentPage: number,
  pageSize: number,
): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(toggleIsFetching(true));
    let data = await usersAPI.getUsers(currentPage, pageSize);
    dispatch(toggleIsFetching(false));
    dispatch(setUsers(data.items));
    dispatch(setTotalUsersCount(data.totalCount));
    dispatch(setCurrentPage(currentPage));
  };
};
export default usersReducer;