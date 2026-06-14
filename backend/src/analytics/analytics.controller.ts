import {
  Controller,
  Get,
  Post,
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
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending content' })
  @ApiResponse({ status: 200, description: 'Trending content' })
  async getTrending(@Query('limit') limit?: number) {
    return this.analyticsService.getTrendingContent(limit);
  }

  @Public()
  @Get('popular/:contentType/:category')
  @ApiOperation({ summary: 'Get popular content by category' })
  @ApiResponse({ status: 200, description: 'Popular content' })
  async getPopularByCategory(
    @Param('contentType') contentType: 'movies' | 'series',
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getPopularByCategory(category, contentType, limit);
  }

  @Public()
  @Post('track-view')
  @ApiOperation({ summary: 'Track a view event' })
  @ApiResponse({ status: 200, description: 'View tracked' })
  async trackView(
    @Body() body: { userId: string; contentId: string; contentType: string; duration: number },
  ) {
    this.analyticsService.trackView({
      ...body,
      contentType: body.contentType as any,
      timestamp: new Date(),
    });
    return { message: 'View tracked' };
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations' })
  async getRecommendations(
    @CurrentUser() user: User,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getUserRecommendations(user.id, limit);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('views')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get view statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'View stats' })
  async getViewStats(@Query('days') days?: number) {
    return this.analyticsService.getViewStats(days);
  }
}
