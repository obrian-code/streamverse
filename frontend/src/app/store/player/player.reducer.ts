import { createReducer, on } from '@ngrx/store';
import { PlayerActions } from './player.actions';

export interface PlayerState {
  isPlaying: boolean;
  currentContent: any | null;
  currentTime: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
  isPiP: boolean;
  quality: string;
  subtitles: { enabled: boolean; language: string };
  error: string | null;
  isLoading: boolean;
}

export const initialPlayerState: PlayerState = {
  isPlaying: false,
  currentContent: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isFullscreen: false,
  isPiP: false,
  quality: 'auto',
  subtitles: { enabled: false, language: 'en' },
  error: null,
  isLoading: false
};

export const playerReducer = createReducer(
  initialPlayerState,

  on(PlayerActions.playContent, (state, { content, startPosition }) => ({
    ...state,
    currentContent: content,
    isPlaying: true,
    currentTime: startPosition || 0,
    isLoading: true,
    error: null
  })),

  on(PlayerActions.playEpisode, (state, { title, subtitle, startPosition }) => ({
    ...state,
    currentContent: { title, subtitle, type: 'episode' },
    isPlaying: true,
    currentTime: startPosition || 0,
    isLoading: true,
    error: null
  })),

  on(PlayerActions.playChannel, (state, { channelName, streamUrl }) => ({
    ...state,
    currentContent: { title: channelName, streamUrl, type: 'channel' },
    isPlaying: true,
    currentTime: 0,
    isLoading: true,
    error: null
  })),

  on(PlayerActions.pause, (state) => ({ ...state, isPlaying: false })),
  on(PlayerActions.resume, (state) => ({ ...state, isPlaying: true })),

  on(PlayerActions.stop, (state) => ({
    ...initialPlayerState
  })),

  on(PlayerActions.seek, (state, { time }) => ({
    ...state, currentTime: time
  })),

  on(PlayerActions.setVolume, (state, { volume }) => ({
    ...state, volume
  })),

  on(PlayerActions.toggleFullscreen, (state) => ({
    ...state, isFullscreen: !state.isFullscreen
  })),

  on(PlayerActions.togglePiP, (state) => ({
    ...state, isPiP: !state.isPiP
  })),

  on(PlayerActions.setQuality, (state, { quality }) => ({
    ...state, quality
  })),

  on(PlayerActions.setSubtitles, (state, { enabled, language }) => ({
    ...state, subtitles: { enabled, language: language || state.subtitles.language }
  })),

  on(PlayerActions.updateProgress, (state, { currentTime, duration }) => ({
    ...state, currentTime, duration, isLoading: false
  })),

  on(PlayerActions.setError, (state, { error }) => ({
    ...state, error, isLoading: false, isPlaying: false
  })),

  on(PlayerActions.clearPlayer, () => initialPlayerState)
);
