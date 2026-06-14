import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.USER,
    });

    await this.usersRepository.save(user);

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
      select: ['id', 'name', 'email', 'password', 'role', 'avatar', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);

    await this.usersRepository.update(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== dto.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      await this.usersRepository.update(user.id, {
        refreshToken: tokens.refreshToken,
      });

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      return { message: 'If the email exists, a reset code has been sent' };
    }

    const resetCode = uuidv4().substring(0, 8).toUpperCase();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersRepository.update(user.id, {
      resetPasswordCode: resetCode,
      resetPasswordToken: resetExpiry,
    });

    this.logger.log(`Password reset code for ${user.email}: ${resetCode}`);

    return { message: 'If the email exists, a reset code has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { resetPasswordCode: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (!user.resetPasswordToken || user.resetPasswordToken < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordCode: null,
      resetPasswordToken: null,
      refreshToken: null,
    });

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, data: Partial<User>) {
    await this.usersRepository.update(userId, data);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return this.sanitizeUser(user);
  }

  async logout(userId: string) {
    try {
      await this.usersRepository.update(userId, {
        refreshToken: null,
      });
    } catch {}
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiration'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiration'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const { password, refreshToken, resetPasswordToken, resetPasswordCode, ...sanitized } = user;
    return sanitized;
  }
}
