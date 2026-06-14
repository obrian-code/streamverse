import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Series, SeriesStatus } from './entities/series.entity';
import { Episode } from './entities/episode.entity';
import {
  CreateSeriesDto,
  UpdateSeriesDto,
  SeriesQueryDto,
  CreateEpisodeDto,
  UpdateEpisodeDto,
} from './dto';

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);

  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Episode)
    private episodesRepository: Repository<Episode>,
  ) {}

  async create(dto: CreateSeriesDto) {
    const series = this.seriesRepository.create(dto);
    await this.seriesRepository.save(series);
    return series;
  }

  async findAll(query: SeriesQueryDto) {
    const { search, category, status, page, limit } = query;
    const where: any = {};

    if (search) {
      where.title = Like(`%${search}%`);
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const [series, total] = await this.seriesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: series,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, includeEpisodes: boolean = false) {
    const relations = includeEpisodes ? ['episodes'] : [];

    const series = await this.seriesRepository.findOne({
      where: { id },
      relations,
      order: includeEpisodes
        ? { episodes: { season: 'ASC', episode: 'ASC' } }
        : undefined,
    });

    if (!series) {
      throw new NotFoundException('Series not found');
    }

    return series;
  }

  async update(id: string, dto: UpdateSeriesDto) {
    const series = await this.findOne(id);
    await this.seriesRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const series = await this.findOne(id);
    await this.seriesRepository.remove(series);
    return { message: 'Series deleted successfully' };
  }

  async getCategories() {
    const categories = await this.seriesRepository
      .createQueryBuilder('series')
      .select('DISTINCT series.category')
      .getRawMany();

    return categories.map((c) => c.series_category);
  }

  async getPublished(query: SeriesQueryDto) {
    return this.findAll({ ...query, status: SeriesStatus.PUBLISHED });
  }

  async incrementViews(id: string) {
    await this.seriesRepository.increment({ id }, 'views', 1);
    return this.findOne(id);
  }

  async getTrending(limit: number = 10) {
    return this.seriesRepository.find({
      where: { status: SeriesStatus.PUBLISHED },
      order: { views: 'DESC' },
      take: limit,
    });
  }

  // Episode methods
  async addEpisode(seriesId: string, dto: CreateEpisodeDto) {
    const series = await this.findOne(seriesId);

    const episode = this.episodesRepository.create({
      ...dto,
      seriesId,
    });

    await this.episodesRepository.save(episode);
    return episode;
  }

  async updateEpisode(episodeId: string, dto: UpdateEpisodeDto) {
    const episode = await this.episodesRepository.findOne({
      where: { id: episodeId },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    await this.episodesRepository.update(episodeId, dto);
    return this.episodesRepository.findOne({ where: { id: episodeId } });
  }

  async removeEpisode(episodeId: string) {
    const episode = await this.episodesRepository.findOne({
      where: { id: episodeId },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    await this.episodesRepository.remove(episode);
    return { message: 'Episode deleted successfully' };
  }

  async getEpisodes(seriesId: string) {
    const series = await this.findOne(seriesId);

    return this.episodesRepository.find({
      where: { seriesId },
      order: { season: 'ASC', episode: 'ASC' },
    });
  }

  async getEpisode(episodeId: string) {
    const episode = await this.episodesRepository.findOne({
      where: { id: episodeId },
      relations: ['series'],
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    return episode;
  }

  async search(query: string) {
    return this.seriesRepository.find({
      where: [
        { title: Like(`%${query}%`), status: SeriesStatus.PUBLISHED },
        { description: Like(`%${query}%`), status: SeriesStatus.PUBLISHED },
      ],
      take: 20,
    });
  }

  async getSeasons(seriesId: string) {
    const episodes = await this.getEpisodes(seriesId);
    const seasonsMap = new Map<number, any>();

    for (const ep of episodes) {
      if (!seasonsMap.has(ep.season)) {
        seasonsMap.set(ep.season, {
          season: ep.season,
          episodes: [],
        });
      }
      seasonsMap.get(ep.season).episodes.push(ep);
    }

    return Array.from(seasonsMap.values());
  }
}
