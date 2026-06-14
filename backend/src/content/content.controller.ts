import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { MoviesService } from '../movies/movies.service';
import { SeriesService } from '../series/series.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { HistoryService } from '../history/history.service';
import { ChannelsService } from '../channels/channels.service';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private analyticsService: AnalyticsService,
    private historyService: HistoryService,
    private channelsService: ChannelsService,
  ) {}

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending content across all types' })
  async getTrending(@Query('limit') limit?: number) {
    const l = limit || 20;
    const [movies, series] = await Promise.all([
      this.moviesService.getTrending(l / 2),
      this.seriesService.getTrending(l / 2),
    ]);
    return { data: [...movies.map(m => ({ ...m, type: 'movie' })), ...series.map(s => ({ ...s, type: 'series' }))] };
  }

  @Get('continue-watching')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get continue watching list' })
  async getContinueWatching(@CurrentUser() user: User, @Query('limit') limit?: number) {
    const items = await this.historyService.getContinueWatching(user.id, limit);
    return { data: items };
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  async getRecommended(@CurrentUser() user: User, @Query('limit') limit?: number) {
    return this.analyticsService.getUserRecommendations(user.id, limit);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured content for hero banner' })
  async getFeatured() {
    const [movies, series] = await Promise.all([
      this.moviesService.getTrending(5),
      this.seriesService.getTrending(5),
    ]);
    const all = [...movies.map(m => ({ ...m, type: 'movie' })), ...series.map(s => ({ ...s, type: 'series' }))];
    return { data: all };
  }
}
