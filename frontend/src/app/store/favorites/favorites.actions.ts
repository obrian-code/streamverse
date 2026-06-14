import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { MediaItem } from '../../core/services/content.service';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Load Favorites': props<{ contentType?: 'movie' | 'series' }>(),
    'Load Favorites Success': props<{ favorites: MediaItem[] }>(),
    'Load Favorites Failure': props<{ error: string }>(),

    'Add Favorite': props<{ contentId: string; contentType: 'movie' | 'series' }>(),
    'Add Favorite Success': props<{ contentId: string }>(),
    'Add Favorite Failure': props<{ error: string }>(),

    'Remove Favorite': props<{ contentId: string }>(),
    'Remove Favorite Success': props<{ contentId: string }>(),
    'Remove Favorite Failure': props<{ error: string }>(),

    'Check Favorite': props<{ contentId: string }>(),
    'Check Favorite Success': props<{ contentId: string; isFavorite: boolean }>(),
  }
});
