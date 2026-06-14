import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { MediaItem } from './content.service';

@Injectable()
export class FavoritesService {
  constructor(private api: ApiService) {}

  getFavorites(contentType?: 'movie' | 'series'): Observable<MediaItem[]> {
    const params = contentType ? { type: contentType } : undefined;
    return this.api.get<MediaItem[]>('favorites', params).pipe(map(r => r.data));
  }

  addFavorite(contentId: string, contentType: 'movie' | 'series'): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('favorites', { contentId, type: contentType }).pipe(map(r => r.data));
  }

  removeFavorite(contentId: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`favorites/${contentId}`).pipe(map(r => r.data));
  }

  isFavorite(contentId: string): Observable<boolean> {
    return this.api.get<{ isFavorite: boolean }>(`favorites/check/${contentId}`).pipe(
      map(r => r.data.isFavorite)
    );
  }
}
