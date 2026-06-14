import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(user => AuthActions.loginSuccess({
            user,
            tokens: { accessToken: this.authService.getAccessToken()!, refreshToken: this.authService.getRefreshToken()!, expiresIn: 3600 }
          })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authService.register(data).pipe(
          map(user => AuthActions.registerSuccess({
            user,
            tokens: { accessToken: this.authService.getAccessToken()!, refreshToken: this.authService.getRefreshToken()!, expiresIn: 3600 }
          })),
          catchError(error => of(AuthActions.registerFailure({ error: error.message })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.authService.logout()),
      map(() => AuthActions.logoutComplete())
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() =>
        this.authService.getProfile().pipe(
          map(user => AuthActions.loadUserSuccess({ user })),
          catchError(error => of(AuthActions.loadUserFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
