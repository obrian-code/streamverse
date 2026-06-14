import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite, FavoriteContentType } from './entities/favorite.entity';
import { AddFavoriteDto } from './dto';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async add(userId: string, dto: AddFavoriteDto) {
    const existing = await this.favoritesRepository.findOne({
      where: {
        userId,
        contentId: dto.contentId,
        contentType: dto.contentType,
      },
    });

    if (existing) {
      throw new ConflictException('Content already in favorites');
    }

    const favorite = this.favoritesRepository.create({
      userId,
      contentId: dto.contentId,
      contentType: dto.contentType,
    });

    await this.favoritesRepository.save(favorite);
    return favorite;
  }

  async remove(userId: string, favoriteId: string) {
    const favorite = await this.favoritesRepository.findOne({
      where: { id: favoriteId, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
    return { message: 'Removed from favorites' };
  }

  async removeByContent(userId: string, contentId: string, contentType: FavoriteContentType) {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, contentId, contentType },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
    return { message: 'Removed from favorites' };
  }

  async findAll(userId: string, contentType?: FavoriteContentType) {
    const where: any = { userId };

    if (contentType) {
      where.contentType = contentType;
    }

    return this.favoritesRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async isFavorite(userId: string, contentId: string, contentType: FavoriteContentType) {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, contentId, contentType },
    });

    return { isFavorite: !!favorite, favoriteId: favorite?.id || null };
  }

  async getFavoritesByType(userId: string, contentType: FavoriteContentType) {
    return this.favoritesRepository.find({
      where: { userId, contentType },
      order: { createdAt: 'DESC' },
    });
  }

  async getFavoriteCount(userId: string) {
    const [movies, series, channels] = await Promise.all([
      this.favoritesRepository.count({
        where: { userId, contentType: FavoriteContentType.MOVIE },
      }),
      this.favoritesRepository.count({
        where: { userId, contentType: FavoriteContentType.SERIES },
      }),
      this.favoritesRepository.count({
        where: { userId, contentType: FavoriteContentType.CHANNEL },
      }),
    ]);

    return {
      total: movies + series + channels,
      movies,
      series,
      channels,
    };
  }

  async getUserFavoriteIds(userId: string): Promise<string[]> {
    const favorites = await this.favoritesRepository.find({
      where: { userId },
      select: ['contentId'],
    });
    return favorites.map((f) => f.contentId);
  }
}
