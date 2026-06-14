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
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'Movies list' })
  async findAll(@Query() query: MovieQueryDto) {
    return this.moviesService.findAll(query);
  }

  @Public()
  @Get('published')
  @ApiOperation({ summary: 'Get published movies' })
  @ApiResponse({ status: 200, description: 'Published movies' })
  async getPublished(@Query() query: MovieQueryDto) {
    return this.moviesService.getPublished(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured movies for hero' })
  @ApiResponse({ status: 200, description: 'Featured movies' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.moviesService.getTrending(limit);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending movies' })
  @ApiResponse({ status: 200, description: 'Trending movies' })
  async getTrending(@Query('limit') limit?: number) {
    return this.moviesService.getTrending(limit);
  }

  @Public()
  @Get('latest')
  @ApiOperation({ summary: 'Get latest movies' })
  @ApiResponse({ status: 200, description: 'Latest movies' })
  async getLatest(@Query('limit') limit?: number) {
    return this.moviesService.getLatest(limit);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all movie categories' })
  @ApiResponse({ status: 200, description: 'Categories list' })
  async getCategories() {
    return this.moviesService.getCategories();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search movies' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') q: string) {
    return this.moviesService.search(q);
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({ summary: 'Get movies by category' })
  @ApiResponse({ status: 200, description: 'Category movies' })
  async getByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ) {
    return this.moviesService.getByCategory(category, limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Public()
  @Post(':id/view')
  @ApiOperation({ summary: 'Increment movie view count' })
  @ApiResponse({ status: 200, description: 'View counted' })
  async incrementViews(@Param('id') id: string) {
    return this.moviesService.incrementViews(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a movie (Admin)' })
  @ApiResponse({ status: 201, description: 'Movie created' })
  async create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update movie (Admin)' })
  @ApiResponse({ status: 200, description: 'Movie updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete movie (Admin)' })
  @ApiResponse({ status: 200, description: 'Movie deleted' })
  async remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
