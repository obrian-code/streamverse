import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectFavorites = createSelector(selectFavoritesState, state => state.favorites);
export const selectFavoriteIds = createSelector(selectFavoritesState, state => state.favoriteIds);
export const selectFavoritesLoading = createSelector(selectFavoritesState, state => state.loading);
export const selectFavoritesError = createSelector(selectFavoritesState, state => state.error);

export const selectIsFavorite = (contentId: string) =>
  createSelector(selectFavoriteIds, ids => ids.has(contentId));
