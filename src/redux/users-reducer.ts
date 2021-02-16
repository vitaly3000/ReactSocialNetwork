import { usersAPI } from '../api/users-api';
import { UserType } from '../types/types';
import { BaseThunkType, InferActionsTypes } from './redux-store';
type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;
let initialState = {
  users: [] as Array<UserType>,
  pageSize: 10,
  totalUsersCount: 250,
  currentPage: 1,
  isFetching: false,
  followingInProgress: [] as Array<number>,
};

const usersReducer = (
  state = initialState,
  action: ActionsTypes,
): InitialStateType => {
  switch (action.type) {
    case 'TOGGLE_FOLLOW': {
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
    case 'SET_USERS': {
      return {
        ...state,
        users: action.users,
      };
    }
    case 'SET_CURRENT_PAGE': {
      return {
        ...state,
        currentPage: action.pageNumber,
      };
    }
    case 'SET_TOTAL_USERS_COUNT': {
      return {
        ...state,
        totalUsersCount: action.totalUsersCount,
      };
    }
    case 'TOGGLE_IS_FETCHING': {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    case 'TOGGLE_IS_FOLLOWING_PROGRESS': {
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

const actions = {
  toggleFollow: (userId: number) => {
    return { type: 'TOGGLE_FOLLOW', userId } as const;
  },

  setUsers: (users: Array<UserType>) => {
    return { type: 'SET_USERS', users } as const;
  },

  setCurrentPage: (pageNumber: number = 1) => {
    return { type: 'SET_CURRENT_PAGE', pageNumber } as const;
  },

  setTotalUsersCount: (totalUsersCount: number) => {
    return { type: 'SET_TOTAL_USERS_COUNT', totalUsersCount } as const;
  },

  toggleIsFetching: (isFetching: boolean) => {
    return { type: 'TOGGLE_IS_FETCHING', isFetching } as const;
  },
  toggleFollowingProgress: (isFetching: boolean, userId: number) => {
    return {
      type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
      isFetching,
      userId,
    } as const;
  },
};

export let follow = (userId: number): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.toggleFollowingProgress(true, userId));
    let data = await usersAPI.followUser(userId);
    dispatch(actions.toggleFollowingProgress(false, userId));
    if (data.resultCode === 0) {
      dispatch(actions.toggleFollow(userId));
    }
  };
};
export let unfollow = (userId: number): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.toggleFollowingProgress(true, userId));
    let data = await usersAPI.unfollowUser(userId);
    dispatch(actions.toggleFollowingProgress(false, userId));
    if (data.resultCode === 0) {
      dispatch(actions.toggleFollow(userId));
    }
  };
};

export let requestUsers = (
  currentPage: number,
  pageSize: number,
): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(actions.toggleIsFetching(true));
    let data = await usersAPI.getUsers(currentPage, pageSize);
    dispatch(actions.toggleIsFetching(false));
    dispatch(actions.setUsers(data.items));
    dispatch(actions.setTotalUsersCount(data.totalCount));
    dispatch(actions.setCurrentPage(currentPage));
  };
};
export default usersReducer;
