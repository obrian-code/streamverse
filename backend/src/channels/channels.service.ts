import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Channel, ChannelStatus } from './entities/channel.entity';
import { CreateChannelDto, UpdateChannelDto, ChannelQueryDto } from './dto';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async create(dto: CreateChannelDto) {
    const channel = this.channelsRepository.create(dto);
    await this.channelsRepository.save(channel);
    return channel;
  }

  async findAll(query: ChannelQueryDto) {
    const { search, category, country, status, page, limit } = query;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (category) {
      where.category = category;
    }

    if (country) {
      where.country = country;
    }

    if (status) {
      where.status = status;
    }

    const [channels, total] = await this.channelsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: channels,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const channel = await this.channelsRepository.findOne({ where: { id } });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async update(id: string, dto: UpdateChannelDto) {
    const channel = await this.findOne(id);
    await this.channelsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const channel = await this.findOne(id);
    await this.channelsRepository.remove(channel);
    return { message: 'Channel deleted successfully' };
  }

  async updateStatus(id: string, status: ChannelStatus) {
    const channel = await this.findOne(id);
    await this.channelsRepository.update(id, { status });
    return this.findOne(id);
  }

  async getCategories() {
    const categories = await this.channelsRepository
      .createQueryBuilder('channel')
      .select('DISTINCT channel.category')
      .getRawMany();

    return categories.map((c) => c.channel_category);
  }

  async getEPG(id: string) {
    const channel = await this.findOne(id);

    if (!channel.epgData) {
      return { epgData: [] };
    }

    return { epgData: channel.epgData };
  }

  async updateEPG(id: string, epgData: Record<string, any>) {
    const channel = await this.findOne(id);
    await this.channelsRepository.update(id, { epgData });
    return this.findOne(id);
  }

  async getActiveChannels() {
    return this.channelsRepository.find({
      where: { status: ChannelStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async search(query: string) {
    return this.channelsRepository.find({
      where: [
        { name: Like(`%${query}%`), status: ChannelStatus.ACTIVE },
      ],
      take: 20,
    });
  }
}
