import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Series, Channel, Favorite])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
