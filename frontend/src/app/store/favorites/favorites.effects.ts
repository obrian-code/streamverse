import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { FavoritesActions } from './favorites.actions';
import { FavoritesService } from '../../core/services/favorites.service';

@Injectable()
export class FavoritesEffects {
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(({ contentType }) =>
        this.favoritesService.getFavorites(contentType).pipe(
          map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
          catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      switchMap(({ contentId, contentType }) =>
        this.favoritesService.addFavorite(contentId, contentType).pipe(
          map(() => FavoritesActions.addFavoriteSuccess({ contentId })),
          catchError(error => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      switchMap(({ contentId }) =>
        this.favoritesService.removeFavorite(contentId).pipe(
          map(() => FavoritesActions.removeFavoriteSuccess({ contentId })),
          catchError(error => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private favoritesService: FavoritesService
  ) {}
}
