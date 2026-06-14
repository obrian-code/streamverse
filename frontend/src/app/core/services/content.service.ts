import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  logoUrl?: string;
  year: number;
  duration: number;
  rating: string;
  maturityRating: string;
  genreIds: string[];
  genres: Genre[];
  cast: CastMember[];
  director?: string;
  trailerUrl?: string;
  videoUrl?: string;
  featured: boolean;
  trending: boolean;
  popularity: number;
  createdAt: string;
  type?: 'movie' | 'series';
}

export interface Movie extends MediaItem {
  type: 'movie';
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  description?: string;
  episodes: Episode[];
  posterUrl?: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  stillUrl?: string;
  airDate?: string;
}

export interface Series extends MediaItem {
  type: 'series';
  seasons: number;
  episodes: number;
  status: 'ongoing' | 'completed' | 'canceled';
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category: string;
  isLive: boolean;
  currentProgram?: EpgProgram;
  nextProgram?: EpgProgram;
  epg: EpgProgram[];
}

export interface EpgProgram {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'movie' | 'series' | 'channel';
  thumbnail?: string;
}

@Injectable()
export class ContentService {
  constructor(private api: ApiService) {}

  getMovies(params?: { page?: number; genre?: string; sort?: string; search?: string }): Observable<ApiResponse<Movie[]>> {
    return this.api.get<Movie[]>('movies', params);
  }

  getMovie(id: string): Observable<Movie> {
    return this.api.get<Movie>(`movies/${id}`).pipe(map(r => r.data));
  }

  getFeaturedMovies(): Observable<Movie[]> {
    return this.api.get<Movie[]>('movies/featured').pipe(map(r => r.data));
  }

  getTrendingMovies(): Observable<Movie[]> {
    return this.api.get<Movie[]>('movies/trending').pipe(map(r => r.data));
  }

  getSeries(params?: { page?: number; genre?: string; sort?: string; search?: string }): Observable<ApiResponse<Series[]>> {
    return this.api.get<Series[]>('series', params);
  }

  getSeriesById(id: string): Observable<Series> {
    return this.api.get<Series>(`series/${id}`).pipe(map(r => r.data));
  }

  getSeasons(seriesId: string): Observable<Season[]> {
    return this.api.get<Season[]>(`series/${seriesId}/seasons`).pipe(map(r => r.data));
  }

  getEpisodes(seriesId: string, seasonId: string): Observable<Episode[]> {
    return this.api.get<Episode[]>(`series/${seriesId}/seasons/${seasonId}/episodes`).pipe(map(r => r.data));
  }

  getEpisode(seriesId: string, seasonId: string, episodeId: string): Observable<Episode> {
    return this.api.get<Episode>(`series/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`).pipe(map(r => r.data));
  }

  getChannels(): Observable<Channel[]> {
    return this.api.get<Channel[]>('channels').pipe(map(r => r.data));
  }

  getChannel(id: string): Observable<Channel> {
    return this.api.get<Channel>(`channels/${id}`).pipe(map(r => r.data));
  }

  getChannelEpg(channelId: string): Observable<EpgProgram[]> {
    return this.api.get<EpgProgram[]>(`channels/${channelId}/epg`).pipe(map(r => r.data));
  }

  getCategories(type?: 'movie' | 'series' | 'channel'): Observable<Category[]> {
    const params = type ? { type } : undefined;
    return this.api.get<Category[]>('categories', params).pipe(map(r => r.data));
  }

  getGenres(): Observable<Genre[]> {
    return this.api.get<Genre[]>('genres').pipe(map(r => r.data));
  }

  search(query: string, type?: string, genre?: string): Observable<(Movie | Series)[]> {
    const params: any = { q: query };
    if (type) params.type = type;
    if (genre) params.genre = genre;
    return this.api.get<(Movie | Series)[]>('search', params).pipe(map(r => r.data));
  }

  getContinueWatching(): Observable<(Movie | Series)[]> {
    return this.api.get<(Movie | Series)[]>('content/continue-watching').pipe(map(r => r.data));
  }

  getRecommended(): Observable<(Movie | Series)[]> {
    return this.api.get<(Movie | Series)[]>('content/recommended').pipe(map(r => r.data));
  }

  getTrending(): Observable<(Movie | Series)[]> {
    return this.api.get<(Movie | Series)[]>('content/trending').pipe(map(r => r.data));
  }
}
