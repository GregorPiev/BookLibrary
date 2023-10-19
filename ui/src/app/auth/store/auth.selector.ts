import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);
