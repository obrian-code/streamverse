import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, Series, Genre } from '../../core/services/content.service';
import { FilterOption } from '../../shared/components/category-filter/category-filter.component';

@Component({
  selector: 'sv-series',
  template: `
    <div class="content-container py-8 space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl md:text-4xl font-bold text-white">Series</h1>
        <p class="text-surface-400">Descubre nuestras series y temporadas completas</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <sv-search-bar (search)="onSearch($event)" placeholder="Buscar series..." />
        </div>
        <select [(ngModel)]="sortBy"
                (ngModelChange)="loadSeries()"
                class="input-field w-auto text-sm">
          <option value="popularity">Más populares</option>
          <option value="rating">Mejor calificadas</option>
          <option value="year">Más recientes</option>
          <option value="title">A-Z</option>
        </select>
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
      } @else if (series().length === 0) {
        <div class="flex flex-col items-center justify-center py-20 space-y-4">
          <mat-icon class="text-6xl text-surface-600">tv_off</mat-icon>
          <h3 class="text-xl text-surface-400">No se encontraron series</h3>
          <p class="text-surface-500 text-sm">Intenta con otros filtros</p>
        </div>
      } @else {
        <div class="content-grid">
          @for (s of series(); track s.id) {
            <sv-content-card
              [content]="s"
              (onClick)="openSeries($event)" />
          }
        </div>

        @if (hasMore()) {
          <div class="flex justify-center pt-8">
            <button class="btn-secondary" (click)="loadMore()" [disabled]="loading()">
              Cargar más
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
export class SeriesComponent implements OnInit {
  private contentService = inject(ContentService);
  private router = inject(Router);

  series = signal<Series[]>([]);
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
    this.loadSeries();
  }

  loadSeries(): void {
    this.loading.set(true);
    this.currentPage = 1;
    this.contentService.getSeries({
      page: this.currentPage,
      genre: this.selectedGenre || undefined,
      sort: this.sortBy,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (response) => {
        this.series.set(response.data);
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
    this.contentService.getSeries({ page: this.currentPage, genre: this.selectedGenre || undefined }).subscribe({
      next: (response) => {
        this.series.update(s => [...s, ...response.data]);
        this.totalPages = response.meta?.totalPages || 1;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.loadSeries();
  }

  onGenreFilter(genreId: string | null): void {
    this.selectedGenre = genreId;
    this.loadSeries();
  }

  openSeries(s: any): void {
    this.router.navigate(['/series', s.id]);
  }
}
