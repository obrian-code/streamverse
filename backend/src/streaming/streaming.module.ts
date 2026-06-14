import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StreamingGateway } from './streaming.gateway';
import { StreamingService } from './streaming.service';
import { Channel } from '../channels/entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.accessExpiration'),
        },
      }),
    }),
  ],
  providers: [StreamingGateway, StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}
