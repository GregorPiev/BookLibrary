import * as AuthActions from './auth.action';

import { createReducer, on } from '@ngrx/store';

export interface AuthState {
  token: string | null;
  error: string | null;
  user: string;
}

const initialState: AuthState = {
  token: null,
  error: null,
  user: ''
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.loginSuccess,
    (state, { token, user }) => (
      { ...state, token, user, error: null })
  ),
  on(
    AuthActions.loginFailure,
    (state, { error }) => ({ ...state, token: null, error })
  ),
  on(
    AuthActions.logout, () => initialState
  ),
  on(
    AuthActions.refreshApp,
    (state, { token, user }) => ({...state, token, user})
  )
);
