import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeriesStatus } from '../entities/series.entity';

export class CreateSeriesDto {
  @ApiProperty({ example: 'Game of Thrones' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Nine noble families fight for control...' })
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

  @ApiProperty({ example: 'Fantasy' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 9.2 })
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
