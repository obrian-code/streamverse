import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History, HistoryContentType } from './entities/history.entity';
import { AddHistoryDto } from './dto';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  async add(userId: string, dto: AddHistoryDto) {
    const existing = await this.historyRepository.findOne({
      where: { userId, contentId: dto.contentId, contentType: dto.contentType },
    });

    if (existing) {
      existing.progress = dto.progress;
      existing.duration = dto.duration;
      existing.resumedAt = dto.resumedAt;
      existing.completed = dto.progress >= 90;
      if (dto.title) existing.title = dto.title;
      if (dto.posterUrl) existing.posterUrl = dto.posterUrl;
      await this.historyRepository.save(existing);
      return existing;
    }

    const history = this.historyRepository.create({
      userId,
      ...dto,
      completed: dto.progress >= 90,
    });
    await this.historyRepository.save(history);
    return history;
  }

  async findAll(userId: string, contentType?: HistoryContentType) {
    const where: any = { userId };
    if (contentType) where.contentType = contentType;

    return this.historyRepository.find({
      where,
      order: { watchedAt: 'DESC' },
      take: 50,
    });
  }

  async updateProgress(id: string, userId: string, progress: number, resumedAt: number) {
    const item = await this.historyRepository.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('History item not found');

    item.progress = progress;
    item.resumedAt = resumedAt;
    item.completed = progress >= 90;
    await this.historyRepository.save(item);
    return item;
  }

  async remove(id: string, userId: string) {
    const item = await this.historyRepository.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('History item not found');
    await this.historyRepository.remove(item);
    return { message: 'History item removed' };
  }

  async clearAll(userId: string) {
    await this.historyRepository.delete({ userId });
    return { message: 'History cleared' };
  }

  async getContinueWatching(userId: string, limit = 20) {
    return this.historyRepository.find({
      where: { userId, completed: false },
      order: { watchedAt: 'DESC' },
      take: limit,
    });
  }
}
