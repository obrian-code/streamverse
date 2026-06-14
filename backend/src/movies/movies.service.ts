import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Movie, MovieStatus } from './entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from './dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(dto: CreateMovieDto) {
    const movie = this.moviesRepository.create(dto);
    await this.moviesRepository.save(movie);
    return movie;
  }

  async findAll(query: MovieQueryDto) {
    const { search, category, status, sortBy, sortOrder, page, limit } = query;
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

    const order: any = {};
    if (sortBy) {
      order[sortBy] = sortOrder || 'DESC';
    } else {
      order.createdAt = 'DESC';
    }

    const [movies, total] = await this.moviesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order,
    });

    return {
      data: movies,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: string, dto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    await this.moviesRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
    return { message: 'Movie deleted successfully' };
  }

  async getCategories() {
    const categories = await this.moviesRepository
      .createQueryBuilder('movie')
      .select('DISTINCT movie.category')
      .getRawMany();

    return categories.map((c) => c.movie_category);
  }

  async getPublished(query: MovieQueryDto) {
    return this.findAll({ ...query, status: MovieStatus.PUBLISHED });
  }

  async incrementViews(id: string) {
    await this.moviesRepository.increment({ id }, 'views', 1);
    return this.findOne(id);
  }

  async getTrending(limit: number = 10) {
    return this.moviesRepository.find({
      where: { status: MovieStatus.PUBLISHED },
      order: { views: 'DESC' },
      take: limit,
    });
  }

  async getLatest(limit: number = 10) {
    return this.moviesRepository.find({
      where: { status: MovieStatus.PUBLISHED },
      order: { releaseDate: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async getByCategory(category: string, limit: number = 20) {
    return this.moviesRepository.find({
      where: { category, status: MovieStatus.PUBLISHED },
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string) {
    return this.moviesRepository.find({
      where: [
        { title: Like(`%${query}%`), status: MovieStatus.PUBLISHED },
        { description: Like(`%${query}%`), status: MovieStatus.PUBLISHED },
      ],
      take: 20,
    });
  }
}
