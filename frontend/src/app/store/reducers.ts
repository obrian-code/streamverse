import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { contentReducer, ContentState } from './content/content.reducer';
import { playerReducer, PlayerState } from './player/player.reducer';
import { favoritesReducer, FavoritesState } from './favorites/favorites.reducer';
import { historyReducer, HistoryState } from './history/history.reducer';

export interface AppState {
  auth: AuthState;
  content: ContentState;
  player: PlayerState;
  favorites: FavoritesState;
  history: HistoryState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  content: contentReducer,
  player: playerReducer,
  favorites: favoritesReducer,
  history: historyReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];
