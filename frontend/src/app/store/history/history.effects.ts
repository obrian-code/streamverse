import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HistoryActions } from './history.actions';
import { HistoryService } from '../../core/services/history.service';

@Injectable()
export class HistoryEffects {
  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HistoryActions.loadHistory),
      switchMap(({ page }) =>
        this.historyService.getHistory({ page }).pipe(
          map(history => HistoryActions.loadHistorySuccess({ history })),
          catchError(error => of(HistoryActions.loadHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  addToHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HistoryActions.addToHistory),
      switchMap(({ data }) =>
        this.historyService.addToHistory(data).pipe(
          map(() => HistoryActions.addToHistorySuccess({
            item: { ...data, id: Date.now().toString(), watchedAt: new Date().toISOString() }
          })),
          catchError(error => of(HistoryActions.addToHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  deleteHistoryItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HistoryActions.deleteHistoryItem),
      switchMap(({ id }) =>
        this.historyService.deleteHistoryItem(id).pipe(
          map(() => HistoryActions.deleteHistoryItemSuccess({ id })),
          catchError(error => of(HistoryActions.deleteHistoryItemFailure({ error: error.message })))
        )
      )
    )
  );

  clearHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HistoryActions.clearHistory),
      switchMap(() =>
        this.historyService.clearHistory().pipe(
          map(() => HistoryActions.clearHistorySuccess()),
          catchError(error => of(HistoryActions.clearHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private historyService: HistoryService
  ) {}
}
