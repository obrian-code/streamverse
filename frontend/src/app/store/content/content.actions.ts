import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Movie, Series, Channel, Genre, MediaItem } from '../../core/services/content.service';

export const ContentActions = createActionGroup({
  source: 'Content',
  events: {
    'Load Featured Movies': emptyProps(),
    'Load Featured Movies Success': props<{ movies: Movie[] }>(),
    'Load Featured Movies Failure': props<{ error: string }>(),

    'Load Trending': emptyProps(),
    'Load Trending Success': props<{ items: MediaItem[] }>(),
    'Load Trending Failure': props<{ error: string }>(),

    'Load Movies': props<{ page?: number; genre?: string }>(),
    'Load Movies Success': props<{ movies: Movie[]; total: number }>(),
    'Load Movies Failure': props<{ error: string }>(),

    'Load Series': props<{ page?: number; genre?: string }>(),
    'Load Series Success': props<{ series: Series[]; total: number }>(),
    'Load Series Failure': props<{ error: string }>(),

    'Load Channels': emptyProps(),
    'Load Channels Success': props<{ channels: Channel[] }>(),
    'Load Channels Failure': props<{ error: string }>(),

    'Load Genres': emptyProps(),
    'Load Genres Success': props<{ genres: Genre[] }>(),
    'Load Genres Failure': props<{ error: string }>(),

    'Search Content': props<{ query: string; type?: string }>(),
    'Search Content Success': props<{ results: MediaItem[] }>(),
    'Search Content Failure': props<{ error: string }>(),

    'Clear Search': emptyProps(),
  }
});
