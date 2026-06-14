import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: dto.role || UserRole.USER,
    });

    await this.usersRepository.save(user);
    return this.sanitizeUser(user);
  }

  async findAll(query: UserQueryDto) {
    const { search, role, page, limit } = query;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async updateAvatar(id: string, avatarPath: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(id, { avatar: avatarPath });
    return this.findOne(id);
  }

  private sanitizeUser(user: User) {
    const { password, refreshToken, resetPasswordToken, resetPasswordCode, ...sanitized } = user;
    return sanitized;
  }
}
