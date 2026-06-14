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
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto, ChannelQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';
import { ChannelStatus } from './entities/channel.entity';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({ status: 200, description: 'Channels list' })
  async findAll(@Query() query: ChannelQueryDto) {
    return this.channelsService.findAll(query);
  }

  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Get active channels' })
  @ApiResponse({ status: 200, description: 'Active channels' })
  async getActive() {
    return this.channelsService.getActiveChannels();
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all channel categories' })
  @ApiResponse({ status: 200, description: 'Categories list' })
  async getCategories() {
    return this.channelsService.getCategories();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel found' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Public()
  @Get(':id/epg')
  @ApiOperation({ summary: 'Get channel EPG data' })
  @ApiResponse({ status: 200, description: 'EPG data' })
  async getEPG(@Param('id') id: string) {
    return this.channelsService.getEPG(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a channel (Admin)' })
  @ApiResponse({ status: 201, description: 'Channel created' })
  async create(@Body() dto: CreateChannelDto) {
    return this.channelsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update channel (Admin)' })
  @ApiResponse({ status: 200, description: 'Channel updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.channelsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete channel (Admin)' })
  @ApiResponse({ status: 200, description: 'Channel deleted' })
  async remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update channel status (Admin)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ChannelStatus,
  ) {
    return this.channelsService.updateStatus(id, status);
  }

  @Patch(':id/epg')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update channel EPG (Admin)' })
  @ApiResponse({ status: 200, description: 'EPG updated' })
  async updateEPG(
    @Param('id') id: string,
    @Body('epgData') epgData: Record<string, any>,
  ) {
    return this.channelsService.updateEPG(id, epgData);
  }
}
