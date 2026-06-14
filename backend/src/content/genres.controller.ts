import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

const GENRES = [
  'Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Terror',
  'Romance', 'Documental', 'Animación', 'Thriller', 'Aventura',
  'Fantasía', 'Misterio', 'Suspenso', 'Musical', 'Western',
  'Deportes', 'Noticias', 'Infantil', 'Educativo', 'Reality',
];

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all content genres' })
  async getGenres() {
    const genres = GENRES.map((name, i) => ({
      id: `genre_${i}`,
      name,
      slug: name.toLowerCase().replace(/[\sóéíáúñ]+/g, '-')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    }));
    return { data: genres };
  }
}
