import { createReducer, on } from '@ngrx/store';
import { HistoryActions } from './history.actions';
import { WatchHistoryItem } from '../../core/services/history.service';

export interface HistoryState {
  history: WatchHistoryItem[];
  loading: boolean;
  error: string | null;
}

export const initialHistoryState: HistoryState = {
  history: [],
  loading: false,
  error: null
};

export const historyReducer = createReducer(
  initialHistoryState,

  on(HistoryActions.loadHistory, (state) => ({
    ...state, loading: true, error: null
  })),

  on(HistoryActions.loadHistorySuccess, (state, { history }) => ({
    ...state, history, loading: false
  })),

  on(HistoryActions.loadHistoryFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(HistoryActions.addToHistory, (state) => ({
    ...state, loading: true
  })),

  on(HistoryActions.addToHistorySuccess, (state, { item }) => ({
    ...state,
    history: [item, ...state.history.filter(h => h.contentId !== item.contentId)],
    loading: false
  })),

  on(HistoryActions.addToHistoryFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(HistoryActions.updateProgressSuccess, (state, { id, progress }) => ({
    ...state,
    history: state.history.map(h => h.id === id ? { ...h, progress } : h)
  })),

  on(HistoryActions.deleteHistoryItemSuccess, (state, { id }) => ({
    ...state,
    history: state.history.filter(h => h.id !== id)
  })),

  on(HistoryActions.clearHistorySuccess, (state) => ({
    ...state, history: []
  }))
);
