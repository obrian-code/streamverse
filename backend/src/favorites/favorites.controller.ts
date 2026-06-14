import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FavoriteContentType } from './entities/favorite.entity';

@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Add content to favorites' })
  @ApiResponse({ status: 201, description: 'Added to favorites' })
  @ApiResponse({ status: 409, description: 'Already in favorites' })
  async add(@CurrentUser() user: User, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.add(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user favorites' })
  @ApiResponse({ status: 200, description: 'Favorites list' })
  async findAll(
    @CurrentUser() user: User,
    @Query('contentType') contentType?: FavoriteContentType,
  ) {
    return this.favoritesService.findAll(user.id, contentType);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get favorite counts' })
  @ApiResponse({ status: 200, description: 'Favorite counts' })
  async getCount(@CurrentUser() user: User) {
    return this.favoritesService.getFavoriteCount(user.id);
  }

  @Get('check')
  @ApiOperation({ summary: 'Check if content is favorited' })
  @ApiResponse({ status: 200, description: 'Favorite status' })
  async isFavorite(
    @CurrentUser() user: User,
    @Query('contentId') contentId: string,
    @Query('contentType') contentType: FavoriteContentType,
  ) {
    return this.favoritesService.isFavorite(user.id, contentId, contentType);
  }

  @Get(':contentType')
  @ApiOperation({ summary: 'Get favorites by type' })
  @ApiResponse({ status: 200, description: 'Favorites by type' })
  async getByType(
    @CurrentUser() user: User,
    @Param('contentType') contentType: FavoriteContentType,
  ) {
    return this.favoritesService.getFavoritesByType(user.id, contentType);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove favorite by ID' })
  @ApiResponse({ status: 200, description: 'Removed from favorites' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.favoritesService.remove(user.id, id);
  }

  @Delete('content/:contentType/:contentId')
  @ApiOperation({ summary: 'Remove favorite by content' })
  @ApiResponse({ status: 200, description: 'Removed from favorites' })
  async removeByContent(
    @CurrentUser() user: User,
    @Param('contentType') contentType: FavoriteContentType,
    @Param('contentId') contentId: string,
  ) {
    return this.favoritesService.removeByContent(user.id, contentId, contentType);
  }
}
