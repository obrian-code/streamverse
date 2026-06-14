import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { MediaItem } from '../../core/services/content.service';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    'Play Content': props<{ content: MediaItem; startPosition?: number }>(),
    'Play Episode': props<{ seriesId: string; episodeId: string; title: string; subtitle?: string; startPosition?: number }>(),
    'Play Channel': props<{ channelId: string; channelName: string; streamUrl: string }>(),
    'Pause': emptyProps(),
    'Resume': emptyProps(),
    'Stop': emptyProps(),
    'Seek': props<{ time: number }>(),
    'Set Volume': props<{ volume: number }>(),
    'Toggle Fullscreen': emptyProps(),
    'Toggle PiP': emptyProps(),
    'Set Quality': props<{ quality: string }>(),
    'Set Subtitles': props<{ enabled: boolean; language?: string }>(),
    'Update Progress': props<{ currentTime: number; duration: number }>(),
    'Set Error': props<{ error: string }>(),
    'Clear Player': emptyProps(),
  }
});
