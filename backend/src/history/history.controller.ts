import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { AddHistoryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { HistoryContentType } from './entities/history.entity';

@ApiTags('History')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Add or update watch history' })
  @ApiResponse({ status: 201, description: 'History added' })
  async add(@CurrentUser() user: User, @Body() dto: AddHistoryDto) {
    return this.historyService.add(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user watch history' })
  @ApiResponse({ status: 200, description: 'History list' })
  async findAll(
    @CurrentUser() user: User,
    @Query('contentType') contentType?: HistoryContentType,
  ) {
    return this.historyService.findAll(user.id, contentType);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update watch progress' })
  @ApiResponse({ status: 200, description: 'Progress updated' })
  async updateProgress(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('progress') progress: number,
    @Body('resumedAt') resumedAt: number,
  ) {
    return this.historyService.updateProgress(id, user.id, progress, resumedAt);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove history item' })
  @ApiResponse({ status: 200, description: 'History item removed' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.historyService.remove(id, user.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all history' })
  @ApiResponse({ status: 200, description: 'History cleared' })
  async clearAll(@CurrentUser() user: User) {
    return this.historyService.clearAll(user.id);
  }
}
