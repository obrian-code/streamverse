import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelStatus } from '../entities/channel.entity';

export class CreateChannelDto {
  @ApiProperty({ example: 'HBO Max' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: 'Entertainment' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'https://example.com/stream.m3u8' })
  @IsString()
  streamUrl: string;

  @ApiPropertyOptional({ example: 'US' })
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
