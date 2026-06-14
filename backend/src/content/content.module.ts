import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { SearchController } from './search.controller';
import { CategoriesController } from './categories.controller';
import { GenresController } from './genres.controller';
import { MoviesModule } from '../movies/movies.module';
import { SeriesModule } from '../series/series.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { HistoryModule } from '../history/history.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    MoviesModule,
    SeriesModule,
    AnalyticsModule,
    HistoryModule,
    ChannelsModule,
  ],
  controllers: [ContentController, SearchController, CategoriesController, GenresController],
})
export class ContentModule {}
