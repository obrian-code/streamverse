import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { WatchHistoryItem } from '../../core/services/history.service';

export const HistoryActions = createActionGroup({
  source: 'History',
  events: {
    'Load History': props<{ page?: number }>(),
    'Load History Success': props<{ history: WatchHistoryItem[] }>(),
    'Load History Failure': props<{ error: string }>(),

    'Add To History': props<{ data: Omit<WatchHistoryItem, 'id' | 'watchedAt'> }>(),
    'Add To History Success': props<{ item: WatchHistoryItem }>(),
    'Add To History Failure': props<{ error: string }>(),

    'Update Progress': props<{ id: string; progress: number; resumedAt: number }>(),
    'Update Progress Success': props<{ id: string; progress: number }>(),
    'Update Progress Failure': props<{ error: string }>(),

    'Delete History Item': props<{ id: string }>(),
    'Delete History Item Success': props<{ id: string }>(),
    'Delete History Item Failure': props<{ error: string }>(),

    'Clear History': emptyProps(),
    'Clear History Success': emptyProps(),
    'Clear History Failure': props<{ error: string }>(),
  }
});
