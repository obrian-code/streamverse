import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { MoviesService } from '../movies/movies.service';
import { SeriesService } from '../series/series.service';
import { ChannelsService } from '../channels/channels.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private channelsService: ChannelsService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Global search across all content' })
  async search(@Query('q') q: string, @Query('type') type?: string) {
    if (!q || q.trim().length < 2) return { data: [] };

    const queries: Promise<any>[] = [];

    if (!type || type === 'movie') {
      queries.push(this.moviesService.search(q).then(r => r.map(m => ({ ...m, type: 'movie' }))));
    }
    if (!type || type === 'series') {
      queries.push(this.seriesService.search(q).then(r => r.map(s => ({ ...s, type: 'series' }))));
    }
    if (!type || type === 'channel') {
      queries.push(this.channelsService.search(q).then(r => r.map(c => ({ ...c, type: 'channel' }))));
    }

    const results = await Promise.all(queries);
    return { data: results.flat() };
  }
}
