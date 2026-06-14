import { createReducer, on } from '@ngrx/store';
import { FavoritesActions } from './favorites.actions';
import { MediaItem } from '../../core/services/content.service';

export interface FavoritesState {
  favorites: MediaItem[];
  favoriteIds: Set<string>;
  loading: boolean;
  error: string | null;
}

export const initialFavoritesState: FavoritesState = {
  favorites: [],
  favoriteIds: new Set(),
  loading: false,
  error: null
};

export const favoritesReducer = createReducer(
  initialFavoritesState,

  on(FavoritesActions.loadFavorites, (state) => ({
    ...state, loading: true, error: null
  })),

  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites,
    favoriteIds: new Set(favorites.map(f => f.id)),
    loading: false
  })),

  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(FavoritesActions.addFavorite, (state) => ({
    ...state, loading: true
  })),

  on(FavoritesActions.addFavoriteSuccess, (state, { contentId }) => {
    const newIds = new Set(state.favoriteIds);
    newIds.add(contentId);
    return { ...state, favoriteIds: newIds, loading: false };
  }),

  on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(FavoritesActions.removeFavorite, (state) => ({
    ...state, loading: true
  })),

  on(FavoritesActions.removeFavoriteSuccess, (state, { contentId }) => {
    const newIds = new Set(state.favoriteIds);
    newIds.delete(contentId);
    return {
      ...state,
      favoriteIds: newIds,
      favorites: state.favorites.filter(f => f.id !== contentId),
      loading: false
    };
  }),

  on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(FavoritesActions.checkFavoriteSuccess, (state, { contentId, isFavorite }) => {
    const newIds = new Set(state.favoriteIds);
    if (isFavorite) {
      newIds.add(contentId);
    } else {
      newIds.delete(contentId);
    }
    return { ...state, favoriteIds: newIds };
  })
);
