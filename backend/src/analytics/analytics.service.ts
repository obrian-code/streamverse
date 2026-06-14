import { Injectable, Logger } from '@nestjs/common';
import { MovieStatus } from '../movies/entities/movie.entity';
import { SeriesStatus } from '../series/entities/series.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

interface ViewEvent {
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series' | 'episode' | 'channel';
  duration: number;
  timestamp: Date;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private viewBuffer: ViewEvent[] = [];

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  trackView(event: ViewEvent) {
    this.viewBuffer.push(event);

    if (this.viewBuffer.length >= 100) {
      this.flushViewBuffer();
    }
  }

  async flushViewBuffer() {
    if (this.viewBuffer.length === 0) return;

    const buffer = [...this.viewBuffer];
    this.viewBuffer = [];

    const counts = new Map<string, { movie: number; series: number; channel: number }>();

    for (const event of buffer) {
      const key = event.contentId;
      if (!counts.has(key)) {
        counts.set(key, { movie: 0, series: 0, channel: 0 });
      }

      const typeKey = event.contentType as keyof (typeof counts extends Map<string, infer T> ? T : never);
      if (typeKey in ['movie', 'series', 'channel']) {
        counts.get(key)![event.contentType === 'episode' ? 'series' : event.contentType]++;
      }
    }

    for (const [contentId, typeCounts] of counts) {
      if (typeCounts.movie > 0) {
        await this.moviesRepository.increment({ id: contentId }, 'views', typeCounts.movie);
      }
      if (typeCounts.series > 0) {
        await this.seriesRepository.increment({ id: contentId }, 'views', typeCounts.series);
      }
    }

    this.logger.log(`Flushed ${buffer.length} view events`);
  }

  async getTrendingContent(limit: number = 10) {
    const [movies, series] = await Promise.all([
      this.moviesRepository.find({
        where: { status: MovieStatus.PUBLISHED },
        order: { views: 'DESC' },
        take: limit,
      }),
      this.seriesRepository.find({
        where: { status: SeriesStatus.PUBLISHED },
        order: { views: 'DESC' },
        take: limit,
      }),
    ]);

    const combined = [
      ...movies.map((m) => ({ ...m, contentType: 'movie' })),
      ...series.map((s) => ({ ...s, contentType: 'series' })),
    ];

    combined.sort((a, b) => (b.views || 0) - (a.views || 0));

    return combined.slice(0, limit);
  }

  async getPopularByCategory(category: string, contentType: 'movies' | 'series', limit: number = 10) {
    if (contentType === 'movies') {
      return this.moviesRepository.find({
        where: { category, status: MovieStatus.PUBLISHED },
        order: { views: 'DESC' },
        take: limit,
      });
    }

    return this.seriesRepository.find({
      where: { category, status: SeriesStatus.PUBLISHED },
      order: { views: 'DESC' },
      take: limit,
    });
  }

  async getUserRecommendations(userId: string, limit: number = 10) {
    const userFavorites = await this.favoritesRepository.find({
      where: { userId },
    });

    if (userFavorites.length === 0) {
      return this.getTrendingContent(limit);
    }

    const favoriteCategories = new Set<string>();

    for (const fav of userFavorites) {
      if (fav.contentType === 'movie') {
        const movie = await this.moviesRepository.findOne({
          where: { id: fav.contentId },
        });
        if (movie?.category) favoriteCategories.add(movie.category);
      } else if (fav.contentType === 'series') {
        const series = await this.seriesRepository.findOne({
          where: { id: fav.contentId },
        });
        if (series?.category) favoriteCategories.add(series.category);
      }
    }

    const favoriteIds = new Set(userFavorites.map((f) => f.contentId));

    const recommendations: any[] = [];

    for (const category of favoriteCategories) {
      const movies = await this.moviesRepository.find({
        where: { category, status: MovieStatus.PUBLISHED },
        order: { views: 'DESC' },
        take: limit,
      });

      for (const movie of movies) {
        if (!favoriteIds.has(movie.id) && recommendations.length < limit) {
          recommendations.push({ ...movie, contentType: 'movie' });
        }
      }
    }

    if (recommendations.length < limit) {
      const trending = await this.getTrendingContent(limit - recommendations.length);
      for (const item of trending) {
        if (!favoriteIds.has(item.id) && !recommendations.find((r) => r.id === item.id)) {
          recommendations.push(item);
        }
      }
    }

    return recommendations.slice(0, limit);
  }

  async getDashboardStats() {
    const [
      totalMovies,
      totalSeries,
      totalChannels,
      totalUsers,
      trending,
    ] = await Promise.all([
      this.moviesRepository.count(),
      this.seriesRepository.count(),
      this.channelsRepository.count(),
      this.favoritesRepository
        .createQueryBuilder('favorite')
        .select('DISTINCT favorite.userId')
        .getRawMany()
        .then((r) => r.length),
      this.getTrendingContent(5),
    ]);

    return {
      totalContent: totalMovies + totalSeries + totalChannels,
      totalMovies,
      totalSeries,
      totalChannels,
      totalUsers,
      trending,
    };
  }

  async getViewStats(days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [movies, series] = await Promise.all([
      this.moviesRepository
        .createQueryBuilder('movie')
        .select('SUM(movie.views)', 'totalViews')
        .addSelect('COUNT(movie.id)', 'totalContent')
        .getRawOne(),
      this.seriesRepository
        .createQueryBuilder('series')
        .select('SUM(series.views)', 'totalViews')
        .addSelect('COUNT(series.id)', 'totalContent')
        .getRawOne(),
    ]);

    return {
      movies: {
        totalViews: parseInt(movies?.totalViews) || 0,
        totalContent: parseInt(movies?.totalContent) || 0,
      },
      series: {
        totalViews: parseInt(series?.totalViews) || 0,
        totalContent: parseInt(series?.totalContent) || 0,
      },
      period: `${days} days`,
    };
  }
}
