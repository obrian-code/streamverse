import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEpisodeDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  season: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  episode: number;

  @ApiProperty({ example: 'Winter Is Coming' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/episode.mp4' })
  @IsString()
  videoUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
