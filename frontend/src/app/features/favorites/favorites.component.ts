import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, MediaItem } from '../../core/services/content.service';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'sv-favorites',
  template: `
    <div class="content-container py-8 space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl md:text-4xl font-bold text-white">Mis Favoritos</h1>
        <p class="text-surface-400">Tu colección personal de contenido</p>
      </div>

      <div class="flex gap-2">
        <button (click)="filterType.set(null)"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                [class.bg-accent]="!filterType()"
                [class.text-white]="!filterType()"
                [class.bg-surface-800]="filterType()"
                [class.text-surface-300]="filterType()">
          Todo
        </button>
        <button (click)="filterType.set('movie')"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                [class.bg-accent]="filterType() === 'movie'"
                [class.text-white]="filterType() === 'movie'"
                [class.bg-surface-800]="filterType() !== 'movie'"
                [class.text-surface-300]="filterType() !== 'movie'">
          Películas
        </button>
        <button (click)="filterType.set('series')"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                [class.bg-accent]="filterType() === 'series'"
                [class.text-white]="filterType() === 'series'"
                [class.bg-surface-800]="filterType() !== 'series'"
                [class.text-surface-300]="filterType() !== 'series'">
          Series
        </button>
      </div>

      @if (loading()) {
        <div class="content-grid">
          @for (_ of [].constructor(12); track _) {
            <div class="aspect-[2/3] skeleton rounded-lg"></div>
          }
        </div>
      } @else if (favorites().length === 0) {
        <sv-empty-state
          icon="favorite_border"
          title="No tienes favoritos"
          message="Agrega películas y series a tu lista de favoritos">
          <a routerLink="/movies" class="btn-primary" actions>Explorar contenido</a>
        </sv-empty-state>
      } @else {
        <div class="content-grid">
          @for (item of favorites(); track item.id) {
            <sv-content-card
              [content]="item"
              (onClick)="navigateToItem($event)" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);

  favorites = signal<MediaItem[]>([]);
  loading = signal(false);
  filterType = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.loading.set(true);
    const type = this.filterType() as 'movie' | 'series' | undefined;
    this.favoritesService.getFavorites(type).subscribe({
      next: (favs) => {
        this.favorites.set(favs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  navigateToItem(item: MediaItem): void {
    if (item.type === 'series') {
      this.router.navigate(['/series', item.id]);
    } else {
      this.router.navigate(['/player', item.id], { queryParams: { type: item.type } });
    }
  }
}
