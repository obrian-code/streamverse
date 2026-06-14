import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

export interface WatchHistoryItem {
  id: string;
  contentId: string;
  title: string;
  posterUrl: string;
  type: 'movie' | 'series' | 'episode';
  seasonNumber?: number;
  episodeNumber?: number;
  progress: number;
  duration: number;
  watchedAt: string;
  resumedAt: number;
}

@Injectable()
export class HistoryService {
  constructor(private api: ApiService) {}

  getHistory(params?: { page?: number; limit?: number }): Observable<WatchHistoryItem[]> {
    return this.api.get<WatchHistoryItem[]>('history', params).pipe(map(r => r.data));
  }

  addToHistory(data: {
    contentId: string;
    type: 'movie' | 'series' | 'episode';
    progress: number;
    duration: number;
    resumedAt: number;
  }): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('history', data).pipe(map(r => r.data));
  }

  updateProgress(id: string, progress: number, resumedAt: number): Observable<{ message: string }> {
    return this.api.patch<{ message: string }>(`history/${id}`, { progress, resumedAt }).pipe(map(r => r.data));
  }

  deleteHistoryItem(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`history/${id}`).pipe(map(r => r.data));
  }

  clearHistory(): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>('history').pipe(map(r => r.data));
  }
}
