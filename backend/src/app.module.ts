import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { MoviesModule } from './movies/movies.module';
import { SeriesModule } from './series/series.module';
import { StreamingModule } from './streaming/streaming.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UploadsModule } from './uploads/uploads.module';
import { HistoryModule } from './history/history.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('app.env') === 'development',
        logging: config.get<string>('app.env') === 'development',
        ssl: config.get<string>('app.env') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('throttle.ttl') * 1000,
            limit: config.get<number>('throttle.limit'),
          },
        ],
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        store: redisStore as any,
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        password: config.get<string>('redis.password'),
        ttl: 60,
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ChannelsModule,
    MoviesModule,
    SeriesModule,
    StreamingModule,
    FavoritesModule,
    AnalyticsModule,
    UploadsModule,
    HistoryModule,
    ContentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
