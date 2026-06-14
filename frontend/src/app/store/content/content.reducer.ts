import { createReducer, on } from '@ngrx/store';
import { ContentActions } from './content.actions';
import { Movie, Series, Channel, Genre, MediaItem } from '../../core/services/content.service';

export interface ContentState {
  featuredMovies: Movie[];
  trending: MediaItem[];
  movies: Movie[];
  series: Series[];
  channels: Channel[];
  genres: Genre[];
  searchResults: MediaItem[];
  totalMovies: number;
  totalSeries: number;
  loading: boolean;
  error: string | null;
}

export const initialContentState: ContentState = {
  featuredMovies: [],
  trending: [],
  movies: [],
  series: [],
  channels: [],
  genres: [],
  searchResults: [],
  totalMovies: 0,
  totalSeries: 0,
  loading: false,
  error: null
};

export const contentReducer = createReducer(
  initialContentState,

  on(ContentActions.loadFeaturedMovies, (state) => ({ ...state, loading: true })),
  on(ContentActions.loadFeaturedMoviesSuccess, (state, { movies }) => ({
    ...state, featuredMovies: movies, loading: false
  })),
  on(ContentActions.loadFeaturedMoviesFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(ContentActions.loadTrending, (state) => ({ ...state, loading: true })),
  on(ContentActions.loadTrendingSuccess, (state, { items }) => ({
    ...state, trending: items, loading: false
  })),

  on(ContentActions.loadMovies, (state) => ({ ...state, loading: true })),
  on(ContentActions.loadMoviesSuccess, (state, { movies, total }) => ({
    ...state, movies, totalMovies: total, loading: false
  })),
  on(ContentActions.loadMoviesFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(ContentActions.loadSeries, (state) => ({ ...state, loading: true })),
  on(ContentActions.loadSeriesSuccess, (state, { series, total }) => ({
    ...state, series, totalSeries: total, loading: false
  })),

  on(ContentActions.loadChannelsSuccess, (state, { channels }) => ({
    ...state, channels
  })),

  on(ContentActions.loadGenresSuccess, (state, { genres }) => ({
    ...state, genres
  })),

  on(ContentActions.searchContent, (state) => ({ ...state, loading: true })),
  on(ContentActions.searchContentSuccess, (state, { results }) => ({
    ...state, searchResults: results, loading: false
  })),
  on(ContentActions.searchContentFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  on(ContentActions.clearSearch, (state) => ({
    ...state, searchResults: []
  }))
);
