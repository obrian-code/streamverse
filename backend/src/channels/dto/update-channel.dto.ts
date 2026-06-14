import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelStatus } from '../entities/channel.entity';

export class UpdateChannelDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  streamUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ enum: ChannelStatus })
  @IsOptional()
  @IsEnum(ChannelStatus)
  status?: ChannelStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  epgData?: Record<string, any>;
}
