import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { Series } from './entities/series.entity';
import { Episode } from './entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Episode])],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
