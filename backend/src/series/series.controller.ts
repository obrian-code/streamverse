import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SeriesService } from './series.service';
import {
  CreateSeriesDto,
  UpdateSeriesDto,
  SeriesQueryDto,
  CreateEpisodeDto,
  UpdateEpisodeDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private seriesService: SeriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all series' })
  @ApiResponse({ status: 200, description: 'Series list' })
  async findAll(@Query() query: SeriesQueryDto) {
    return this.seriesService.findAll(query);
  }

  @Public()
  @Get('published')
  @ApiOperation({ summary: 'Get published series' })
  @ApiResponse({ status: 200, description: 'Published series' })
  async getPublished(@Query() query: SeriesQueryDto) {
    return this.seriesService.getPublished(query);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending series' })
  @ApiResponse({ status: 200, description: 'Trending series' })
  async getTrending(@Query('limit') limit?: number) {
    return this.seriesService.getTrending(limit);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all series categories' })
  @ApiResponse({ status: 200, description: 'Categories list' })
  async getCategories() {
    return this.seriesService.getCategories();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get series by ID' })
  @ApiResponse({ status: 200, description: 'Series found' })
  @ApiResponse({ status: 404, description: 'Series not found' })
  async findOne(@Param('id') id: string, @Query('includeEpisodes') includeEpisodes?: string) {
    return this.seriesService.findOne(id, includeEpisodes === 'true');
  }

  @Public()
  @Post(':id/view')
  @ApiOperation({ summary: 'Increment series view count' })
  @ApiResponse({ status: 200, description: 'View counted' })
  async incrementViews(@Param('id') id: string) {
    return this.seriesService.incrementViews(id);
  }

  // Episode endpoints
  @Public()
  @Get(':id/episodes')
  @ApiOperation({ summary: 'Get all episodes for a series' })
  @ApiResponse({ status: 200, description: 'Episodes list' })
  async getEpisodes(@Param('id') id: string) {
    return this.seriesService.getEpisodes(id);
  }

  @Public()
  @Get(':id/seasons')
  @ApiOperation({ summary: 'Get seasons grouped episodes' })
  @ApiResponse({ status: 200, description: 'Seasons list' })
  async getSeasons(@Param('id') id: string) {
    return this.seriesService.getSeasons(id);
  }

  @Public()
  @Get('episode/:episodeId')
  @ApiOperation({ summary: 'Get episode by ID' })
  @ApiResponse({ status: 200, description: 'Episode found' })
  async getEpisode(@Param('episodeId') episodeId: string) {
    return this.seriesService.getEpisode(episodeId);
  }

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a series (Admin)' })
  @ApiResponse({ status: 201, description: 'Series created' })
  async create(@Body() dto: CreateSeriesDto) {
    return this.seriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update series (Admin)' })
  @ApiResponse({ status: 200, description: 'Series updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
    return this.seriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete series (Admin)' })
  @ApiResponse({ status: 200, description: 'Series deleted' })
  async remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }

  @Post(':id/episodes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add episode to series (Admin)' })
  @ApiResponse({ status: 201, description: 'Episode created' })
  async addEpisode(
    @Param('id') id: string,
    @Body() dto: CreateEpisodeDto,
  ) {
    return this.seriesService.addEpisode(id, dto);
  }

  @Patch('episode/:episodeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update episode (Admin)' })
  @ApiResponse({ status: 200, description: 'Episode updated' })
  async updateEpisode(
    @Param('episodeId') episodeId: string,
    @Body() dto: UpdateEpisodeDto,
  ) {
    return this.seriesService.updateEpisode(episodeId, dto);
  }

  @Delete('episode/:episodeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete episode (Admin)' })
  @ApiResponse({ status: 200, description: 'Episode deleted' })
  async removeEpisode(@Param('episodeId') episodeId: string) {
    return this.seriesService.removeEpisode(episodeId);
  }
}
