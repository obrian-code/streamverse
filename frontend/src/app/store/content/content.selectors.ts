import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContentState } from './content.reducer';

export const selectContentState = createFeatureSelector<ContentState>('content');

export const selectFeaturedMovies = createSelector(selectContentState, state => state.featuredMovies);
export const selectTrending = createSelector(selectContentState, state => state.trending);
export const selectMovies = createSelector(selectContentState, state => state.movies);
export const selectSeries = createSelector(selectContentState, state => state.series);
export const selectChannels = createSelector(selectContentState, state => state.channels);
export const selectGenres = createSelector(selectContentState, state => state.genres);
export const selectSearchResults = createSelector(selectContentState, state => state.searchResults);
export const selectContentLoading = createSelector(selectContentState, state => state.loading);
export const selectContentError = createSelector(selectContentState, state => state.error);
