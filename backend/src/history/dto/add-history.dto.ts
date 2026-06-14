import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HistoryContentType } from '../entities/history.entity';

export class AddHistoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({ enum: HistoryContentType })
  @IsEnum(HistoryContentType)
  contentType: HistoryContentType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  resumedAt: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  seasonNumber?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  episodeNumber?: number;
}
