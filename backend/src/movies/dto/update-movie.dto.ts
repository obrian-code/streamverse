import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus } from '../entities/movie.entity';

export class UpdateMovieDto {
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
  @Min(1)
  duration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({ enum: MovieStatus })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;
}
