import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { MoviesService } from '../movies/movies.service';
import { SeriesService } from '../series/series.service';
import { ChannelsService } from '../channels/channels.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private channelsService: ChannelsService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all content categories' })
  async getCategories(@Query('type') type?: string) {
    const queries: Promise<string[]>[] = [];

    if (!type || type === 'movie') queries.push(this.moviesService.getCategories());
    if (!type || type === 'series') queries.push(this.seriesService.getCategories());
    if (!type || type === 'channel') queries.push(this.channelsService.getCategories());

    const results = await Promise.all(queries);
    const allCategories = [...new Set(results.flat())].map((name, i) => ({
      id: `cat_${i}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }));

    return { data: allCategories };
  }
}
