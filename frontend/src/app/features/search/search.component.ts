import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, MediaItem } from '../../core/services/content.service';

@Component({
  selector: 'sv-search',
  template: `
    <div class="content-container py-8 space-y-8">
      <div class="max-w-2xl mx-auto w-full">
        <sv-search-bar
          [placeholder]="'Busca películas, series...'"
          (search)="onSearch($event)" />
      </div>

      @if (query()) {
        <div class="flex items-center justify-between">
          <p class="text-surface-400 text-sm">
            Resultados para <span class="text-white font-medium">"{{ query() }}"</span>
          </p>
          <p class="text-surface-500 text-sm">{{ results().length }} resultados</p>
        </div>
      }

      <div class="flex gap-2">
        <button (click)="selectedType.set(null); applyFilters()"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                [class.bg-accent]="!selectedType()"
                [class.text-white]="!selectedType()"
                [class.bg-surface-800]="selectedType()"
                [class.text-surface-300]="selectedType()">
          Todo
        </button>
        <button (click)="selectedType.set('movie'); applyFilters()"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                [class.bg-accent]="selectedType() === 'movie'"
                [class.text-white]="selectedType() === 'movie'"
                [class.bg-surface-800]="selectedType() !== 'movie'"
                [class.text-surface-300]="selectedType() !== 'movie'">
          Películas
        </button>
        <button (click)="selectedType.set('series'); applyFilters()"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                [class.bg-accent]="selectedType() === 'series'"
                [class.text-white]="selectedType() === 'series'"
                [class.bg-surface-800]="selectedType() !== 'series'"
                [class.text-surface-300]="selectedType() !== 'series'">
          Series
        </button>
      </div>

      @if (loading()) {
        <div class="content-grid">
          @for (_ of [].constructor(12); track _) {
            <div class="aspect-[2/3] skeleton rounded-lg"></div>
          }
        </div>
      } @else if (results().length > 0) {
        <div class="content-grid">
          @for (item of results(); track item.id) {
            <sv-content-card
              [content]="item"
              (onClick)="navigateToItem($event)" />
          }
        </div>
      } @else if (query()) {
        <div class="flex flex-col items-center justify-center py-20 space-y-4">
          <mat-icon class="text-6xl text-surface-600">search_off</mat-icon>
          <h3 class="text-xl text-surface-400">Sin resultados</h3>
          <p class="text-surface-500 text-sm">No encontramos contenido para "{{ query() }}"</p>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20 space-y-4">
          <mat-icon class="text-6xl text-surface-600">search</mat-icon>
          <h3 class="text-xl text-surface-400">Busca tu contenido favorito</h3>
          <p class="text-surface-500 text-sm">Encuentra películas, series y canales</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);

  query = signal('');
  results = signal<MediaItem[]>([]);
  loading = signal(false);
  selectedType = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      if (q) {
        this.query.set(q);
        this.performSearch(q);
      }
    });
  }

  onSearch(query: string): void {
    this.query.set(query);
    this.router.navigate([], { queryParams: { q: query || null }, replaceUrl: true });
    if (query.trim()) {
      this.performSearch(query);
    } else {
      this.results.set([]);
    }
  }

  private performSearch(query: string): void {
    this.loading.set(true);
    this.contentService.search(query, this.selectedType() || undefined).subscribe({
      next: (results) => {
        this.results.set(results);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    this.performSearch(this.query());
  }

  navigateToItem(item: MediaItem): void {
    if (item.type === 'series') {
      this.router.navigate(['/series', item.id]);
    } else {
      this.router.navigate(['/player', item.id], { queryParams: { type: item.type } });
    }
  }
}
