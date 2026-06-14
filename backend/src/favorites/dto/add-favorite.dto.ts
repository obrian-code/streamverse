import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FavoriteContentType } from '../entities/favorite.entity';

export class AddFavoriteDto {
  @ApiProperty({ description: 'Content ID (movie, series, or channel ID)' })
  @IsString()
  contentId: string;

  @ApiProperty({ enum: FavoriteContentType })
  @IsEnum(FavoriteContentType)
  contentType: FavoriteContentType;
}
