import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus } from '../entities/movie.entity';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'A thief who steals corporate secrets...' })
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

  @ApiProperty({ example: 'Action' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 148 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: '2010-07-16' })
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  @ApiPropertyOptional({ example: 8.8 })
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
