import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, Movie, Genre } from '../../core/services/content.service';
import { FilterOption } from '../../shared/components/category-filter/category-filter.component';

@Component({
  selector: 'sv-movies',
  template: `
    <div class="content-container py-8 space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl md:text-4xl font-bold text-white">Películas</h1>
        <p class="text-surface-400">Explora nuestro catálogo de películas</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <sv-search-bar (search)="onSearch($event)" placeholder="Buscar películas..." />
        </div>
        <div class="flex gap-2">
          <select [(ngModel)]="sortBy"
                  (ngModelChange)="loadMovies()"
                  class="input-field w-auto text-sm">
            <option value="popularity">Más populares</option>
            <option value="rating">Mejor calificadas</option>
            <option value="year">Más recientes</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      <sv-category-filter
        [options]="categoryOptions()"
        (filterChange)="onGenreFilter($event)" />

      @if (loading()) {
        <div class="content-grid">
          @for (_ of [].constructor(12); track _) {
            <div class="aspect-[2/3] skeleton rounded-lg"></div>
          }
        </div>
      } @else if (movies().length === 0) {
        <sv-empty-state
          icon="movie_off"
          title="No se encontraron películas"
          message="Intenta con otros filtros o términos de búsqueda" />
      } @else {
        <div class="content-grid">
          @for (movie of movies(); track movie.id) {
            <sv-content-card
              [content]="movie"
              (onClick)="playMovie($event)" />
          }
        </div>

        @if (hasMore()) {
          <div class="flex justify-center pt-8">
            <button class="btn-secondary" (click)="loadMore()" [disabled]="loading()">
              @if (loading()) {
                <mat-spinner diameter="20" strokeWidth="3"></mat-spinner>
              } @else {
                <span>Cargar más</span>
              }
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class MoviesComponent implements OnInit {
  private contentService = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movies = signal<Movie[]>([]);
  genres = signal<Genre[]>([]);
  loading = signal(false);
  searchQuery = '';
  sortBy = 'popularity';
  selectedGenre: string | null = null;
  currentPage = 1;
  totalPages = 1;

  hasMore = computed(() => this.currentPage < this.totalPages);

  categoryOptions = computed<FilterOption[]>(() =>
    this.genres().map(g => ({ id: g.id, label: g.name }))
  );

  ngOnInit(): void {
    this.contentService.getGenres().subscribe({
      next: (genres) => this.genres.set(genres)
    });
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.currentPage = 1;

    this.contentService.getMovies({
      page: this.currentPage,
      genre: this.selectedGenre || undefined,
      sort: this.sortBy,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (response) => {
        this.movies.set(response.data);
        this.totalPages = response.meta?.totalPages || 1;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);
    this.currentPage++;

    this.contentService.getMovies({
      page: this.currentPage,
      genre: this.selectedGenre || undefined,
      sort: this.sortBy
    }).subscribe({
      next: (response) => {
        this.movies.update(m => [...m, ...response.data]);
        this.totalPages = response.meta?.totalPages || 1;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.loadMovies();
  }

  onGenreFilter(genreId: string | null): void {
    this.selectedGenre = genreId;
    this.loadMovies();
  }

  playMovie(movie: any): void {
    this.router.navigate(['/player', movie.id], { queryParams: { type: 'movie' } });
  }
}
