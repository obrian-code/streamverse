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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawMedia = any;

function mapMediaItem(raw: RawMedia): MediaItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    posterUrl: raw.poster ?? raw.posterUrl ?? '',
    backdropUrl: raw.backdrop ?? raw.backdropUrl ?? '',
    logoUrl: raw.logo ?? raw.logoUrl,
    year: raw.releaseDate ? new Date(raw.releaseDate).getFullYear() : (raw.year || 0),
    duration: raw.duration || 0,
    rating: String(raw.rating ?? ''),
    maturityRating: raw.maturityRating ?? '',
    genreIds: raw.genreIds ?? [],
    genres: raw.genres ?? raw.category ? [{ id: '', name: raw.category, slug: '' }] : [],
    cast: raw.cast ?? [],
    director: raw.director,
    trailerUrl: raw.trailerUrl ?? raw.trailer_url,
    videoUrl: raw.videoUrl ?? raw.video_url,
    featured: raw.featured ?? raw.is_featured ?? false,
    trending: raw.trending ?? raw.is_trending ?? false,
    popularity: raw.popularity ?? raw.views ?? 0,
    createdAt: raw.createdAt ?? raw.created_at ?? '',
    type: raw.type,
  };
}

function mapMovie(raw: RawMedia): Movie {
  return { ...mapMediaItem(raw), type: 'movie' };
}

function mapSeries(raw: RawMedia): Series {
  return {
    ...mapMediaItem(raw),
    type: 'series',
    seasons: raw.seasons ?? raw.totalSeasons ?? 0,
    episodes: raw.episodes ?? raw.totalEpisodes ?? raw.episodeCount ?? 0,
    status: raw.status === 'ongoing' || raw.status === 'completed' || raw.status === 'canceled'
      ? raw.status : 'ongoing',
  };
}

function mapEpisode(raw: RawMedia): Episode {
  return {
    id: raw.id,
    seriesId: raw.seriesId ?? raw.series_id ?? '',
    seasonId: raw.seasonId ?? raw.season_id ?? '',
    episodeNumber: raw.episodeNumber ?? raw.episode ?? 0,
    title: raw.title,
    description: raw.description,
    duration: raw.duration || 0,
    thumbnailUrl: raw.thumbnail ?? raw.thumbnailUrl ?? '',
    videoUrl: raw.videoUrl ?? raw.video_url ?? '',
    stillUrl: raw.stillUrl ?? raw.still_url,
    airDate: raw.airDate ?? raw.air_date,
  };
}

function mapChannel(raw: RawMedia): Channel {
  return {
    id: raw.id,
    name: raw.name,
    logo: raw.logo ?? '',
    streamUrl: raw.streamUrl ?? raw.stream_url ?? '',
    category: raw.category ?? '',
    isLive: raw.isLive ?? raw.is_live ?? raw.status === 'active',
    currentProgram: raw.currentProgram ?? raw.current_program,
    nextProgram: raw.nextProgram ?? raw.next_program,
    epg: raw.epg ?? [],
  };
}

@Injectable()
export class ContentService {
  constructor(private api: ApiService) {}

  private mapMoviesResponse(raw: RawMedia[]): RawMedia[] {
    return raw?.map?.(mapMovie) ?? [];
  }

  getMovies(params?: { page?: number; genre?: string; sortBy?: string; sortOrder?: string; search?: string }): Observable<ApiResponse<Movie[]>> {
    return this.api.get<Movie[]>('movies', params).pipe(
      map(r => ({ ...r, data: this.mapMoviesResponse(r.data as any) }))
    );
  }

  getMovie(id: string): Observable<Movie> {
    return this.api.get<Movie>(`movies/${id}`).pipe(map(r => mapMovie(r.data as any)));
  }

  getFeaturedMovies(): Observable<Movie[]> {
    return this.api.get<Movie[]>('movies/featured').pipe(map(r => this.mapMoviesResponse(r.data as any)));
  }

  getTrendingMovies(): Observable<Movie[]> {
    return this.api.get<Movie[]>('movies/trending').pipe(map(r => this.mapMoviesResponse(r.data as any)));
  }

  getSeries(params?: { page?: number; genre?: string; sort?: string; search?: string }): Observable<ApiResponse<Series[]>> {
    return this.api.get<Series[]>('series', params).pipe(
      map(r => ({ ...r, data: (r.data as any)?.map?.(mapSeries) ?? [] }))
    );
  }

  getSeriesById(id: string): Observable<Series> {
    return this.api.get<Series>(`series/${id}`).pipe(map(r => mapSeries(r.data as any)));
  }

  getSeasons(seriesId: string): Observable<Season[]> {
    return this.api.get<Season[]>(`series/${seriesId}/seasons`).pipe(
      map(r => (r.data as any)?.map?.((s: RawMedia) => ({
        ...s,
        posterUrl: s.poster ?? s.posterUrl,
        episodes: (s.episodes as any[])?.map(mapEpisode) ?? [],
      })) ?? [])
    );
  }

  getEpisodes(seriesId: string, seasonId: string): Observable<Episode[]> {
    return this.api.get<Episode[]>(`series/${seriesId}/seasons/${seasonId}/episodes`).pipe(
      map(r => (r.data as any)?.map?.(mapEpisode) ?? [])
    );
  }

  getEpisode(seriesId: string, seasonId: string, episodeId: string): Observable<Episode> {
    return this.api.get<Episode>(`series/${seriesId}/seasons/${seasonId}/episodes/${episodeId}`).pipe(
      map(r => mapEpisode(r.data as any))
    );
  }

  getChannels(): Observable<Channel[]> {
    return this.api.get<Channel[]>('channels').pipe(
      map(r => (r.data as any)?.map?.(mapChannel) ?? [])
    );
  }

  getChannel(id: string): Observable<Channel> {
    return this.api.get<Channel>(`channels/${id}`).pipe(map(r => mapChannel(r.data as any)));
  }

  getChannelEpg(channelId: string): Observable<EpgProgram[]> {
    return this.api.get<EpgProgram[]>(`channels/${channelId}/epg`).pipe(map(r => r.data));
  }

  getCategories(type?: 'movie' | 'series' | 'channel'): Observable<Category[]> {
    const params = type ? { type } : undefined;
    return this.api.get<{ data: Category[] }>('categories', params).pipe(map(r => r.data.data));
  }

  getGenres(): Observable<Genre[]> {
    return this.api.get<{ data: Genre[] }>('genres').pipe(map(r => r.data.data));
  }

  search(query: string, type?: string, genre?: string): Observable<(Movie | Series)[]> {
    const params: any = { q: query };
    if (type) params.type = type;
    if (genre) params.genre = genre;
    return this.api.get<(Movie | Series)[]>('search', params).pipe(
      map(r => (r.data as any)?.map?.((raw: RawMedia) =>
        raw.type === 'series' ? mapSeries(raw) : mapMovie(raw)
      ) ?? [])
    );
  }

  getContinueWatching(): Observable<(Movie | Series)[]> {
    return this.api.get<{ data: (Movie | Series)[] }>('content/continue-watching').pipe(
      map(r => (r.data.data as any)?.map?.((raw: RawMedia) =>
        raw.type === 'series' ? mapSeries(raw) : mapMovie(raw)
      ) ?? [])
    );
  }

  getRecommended(): Observable<(Movie | Series)[]> {
    return this.api.get<{ data: (Movie | Series)[] }>('content/recommended').pipe(
      map(r => (r.data.data as any)?.map?.((raw: RawMedia) =>
        raw.type === 'series' ? mapSeries(raw) : mapMovie(raw)
      ) ?? [])
    );
  }

  getTrending(): Observable<(Movie | Series)[]> {
    return this.api.get<{ data: (Movie | Series)[] }>('content/trending').pipe(
      map(r => (r.data.data as any)?.map?.((raw: RawMedia) =>
        raw.type === 'series' ? mapSeries(raw) : mapMovie(raw)
      ) ?? [])
    );
  }
}
