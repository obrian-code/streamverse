import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ContentActions } from './content.actions';
import { ContentService } from '../../core/services/content.service';

@Injectable()
export class ContentEffects {
  loadFeaturedMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.loadFeaturedMovies),
      switchMap(() =>
        this.contentService.getFeaturedMovies().pipe(
          map(movies => ContentActions.loadFeaturedMoviesSuccess({ movies })),
          catchError(error => of(ContentActions.loadFeaturedMoviesFailure({ error: error.message })))
        )
      )
    )
  );

  loadTrending$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.loadTrending),
      switchMap(() =>
        this.contentService.getTrending().pipe(
          map(items => ContentActions.loadTrendingSuccess({ items })),
          catchError(error => of(ContentActions.loadTrendingFailure({ error: error.message })))
        )
      )
    )
  );

  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.loadMovies),
      switchMap(({ page, genre }) =>
        this.contentService.getMovies({ page, genre }).pipe(
          map(response => ContentActions.loadMoviesSuccess({ movies: response.data, total: response.meta?.total || 0 })),
          catchError(error => of(ContentActions.loadMoviesFailure({ error: error.message })))
        )
      )
    )
  );

  loadSeries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.loadSeries),
      switchMap(({ page, genre }) =>
        this.contentService.getSeries({ page, genre }).pipe(
          map(response => ContentActions.loadSeriesSuccess({ series: response.data, total: response.meta?.total || 0 })),
          catchError(error => of(ContentActions.loadSeriesFailure({ error: error.message })))
        )
      )
    )
  );

  loadChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.loadChannels),
      switchMap(() =>
        this.contentService.getChannels().pipe(
          map(channels => ContentActions.loadChannelsSuccess({ channels })),
          catchError(error => of(ContentActions.loadChannelsFailure({ error: error.message })))
        )
      )
    )
  );

  loadGenres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.loadGenres),
      switchMap(() =>
        this.contentService.getGenres().pipe(
          map(genres => ContentActions.loadGenresSuccess({ genres })),
          catchError(error => of(ContentActions.loadGenresFailure({ error: error.message })))
        )
      )
    )
  );

  searchContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.searchContent),
      switchMap(({ query, type }) =>
        this.contentService.search(query, type).pipe(
          map(results => ContentActions.searchContentSuccess({ results })),
          catchError(error => of(ContentActions.searchContentFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private contentService: ContentService
  ) {}
}
