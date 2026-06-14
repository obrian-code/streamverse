import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SeriesStatus } from '../entities/series.entity';

export class UpdateSeriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  poster?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backdrop?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({ enum: SeriesStatus })
  @IsOptional()
  @IsEnum(SeriesStatus)
  status?: SeriesStatus;
}
