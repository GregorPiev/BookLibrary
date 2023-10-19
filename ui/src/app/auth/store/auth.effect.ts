import * as AuthActions from './auth.action';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Appstate } from 'src/app/shared/store/appstate';
import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/store/app.action';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private appStore: Store<Appstate>
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(action =>
        this.authService.login(action.username, action.password).pipe(
          map(
            token => {
              if(token == ''){
                this.appStore.dispatch(
                  setAPIStatus({
                    apiStatus: { apiResponseMessage: '', apiStatus: 'false' },
                  })
                );
              }else{
                this.appStore.dispatch(
                  setAPIStatus({
                    apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
                  })
                );
              }
              return AuthActions.loginSuccess({ token, user: action.username })}
          ),
          catchError(
            error => of(AuthActions.loginFailure({ error }))
          )
        )
      )
    )
  );





  // Todo: Other effects for logout, token refresh, etc.

}
