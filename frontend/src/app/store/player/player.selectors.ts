import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectIsPlaying = createSelector(selectPlayerState, state => state.isPlaying);
export const selectCurrentContent = createSelector(selectPlayerState, state => state.currentContent);
export const selectCurrentTime = createSelector(selectPlayerState, state => state.currentTime);
export const selectDuration = createSelector(selectPlayerState, state => state.duration);
export const selectVolume = createSelector(selectPlayerState, state => state.volume);
export const selectIsFullscreen = createSelector(selectPlayerState, state => state.isFullscreen);
export const selectIsPiP = createSelector(selectPlayerState, state => state.isPiP);
export const selectQuality = createSelector(selectPlayerState, state => state.quality);
export const selectSubtitles = createSelector(selectPlayerState, state => state.subtitles);
export const selectPlayerError = createSelector(selectPlayerState, state => state.error);
export const selectPlayerLoading = createSelector(selectPlayerState, state => state.isLoading);
export const selectProgress = createSelector(
  selectCurrentTime,
  selectDuration,
  (currentTime, duration) => duration > 0 ? (currentTime / duration) * 100 : 0
);
