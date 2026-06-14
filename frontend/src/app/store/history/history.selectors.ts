import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HistoryState } from './history.reducer';

export const selectHistoryState = createFeatureSelector<HistoryState>('history');

export const selectHistory = createSelector(selectHistoryState, state => state.history);
export const selectHistoryLoading = createSelector(selectHistoryState, state => state.loading);
export const selectHistoryError = createSelector(selectHistoryState, state => state.error);

export const selectContinueWatching = createSelector(
  selectHistory,
  history => history.filter(h => h.progress > 0 && h.progress < 90).slice(0, 10)
);
