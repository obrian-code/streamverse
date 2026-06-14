import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService, WatchHistoryItem } from '../../core/services/history.service';

@Component({
  selector: 'sv-history',
  template: `
    <div class="content-container py-8 space-y-8">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-bold text-white">Historial</h1>
          <p class="text-surface-400">Contenido que has visto recientemente</p>
        </div>
        @if (history().length > 0) {
          <button class="btn-ghost text-accent flex items-center gap-1 text-sm"
                  (click)="clearAll()">
            <mat-icon class="text-lg">delete_sweep</mat-icon>
            Limpiar historial
          </button>
        }
      </div>

      @if (loading()) {
        <div class="space-y-4">
          @for (_ of [].constructor(6); track _) {
            <div class="flex gap-4 p-3">
              <div class="w-32 aspect-video skeleton rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-5 skeleton rounded w-1/3"></div>
                <div class="h-4 skeleton rounded w-1/4"></div>
                <div class="h-3 skeleton rounded w-1/2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (history().length === 0) {
        <sv-empty-state
          icon="history"
          title="No hay historial"
          message="Los videos que veas aparecerán aquí">
          <a routerLink="/movies" class="btn-primary" actions>Comenzar a ver</a>
        </sv-empty-state>
      } @else {
        <div class="space-y-1">
          @for (item of history(); track item.id) {
            <div class="flex gap-4 p-3 rounded-lg hover:bg-surface-800/30 transition-colors cursor-pointer group"
                 (click)="resumeItem(item)">
              <div class="relative flex-shrink-0 w-32 md:w-40 aspect-video rounded-lg overflow-hidden bg-surface-800">
                <img [src]="item.posterUrl" [alt]="item.title" class="w-full h-full object-cover" />
                @if (item.progress > 0) {
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-surface-700">
                    <div class="h-full bg-accent" [style.width.%]="item.progress"></div>
                  </div>
                }
                <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <mat-icon class="text-white text-3xl">play_circle</mat-icon>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <h3 class="text-white font-medium truncate">{{ item.title }}</h3>
                <div class="flex items-center gap-2 text-xs text-surface-400">
                  @if (item.type === 'episode') {
                    <span class="uppercase text-primary-400">Episodio</span>
                  } @else {
                    <span class="uppercase" [class.text-primary-400]="item.type === 'series'"
                                          [class.text-accent]="item.type === 'movie'">
                      {{ item.type === 'movie' ? 'Película' : 'Serie' }}
                    </span>
                  }
                  @if (item.seasonNumber) {
                    <span>T{{ item.seasonNumber }}</span>
                  }
                  @if (item.episodeNumber) {
                    <span>E{{ item.episodeNumber }}</span>
                  }
                </div>
                <div class="flex items-center gap-2 text-xs text-surface-500">
                  <span>{{ item.progress | number:'1.0-0' }}% completado</span>
                  <span>{{ item.watchedAt | date:'relative' }}</span>
                </div>
              </div>
              <button class="btn-ghost p-2 self-center opacity-0 group-hover:opacity-100 transition-opacity"
                      (click)="$event.stopPropagation(); deleteItem(item.id)"
                      matTooltip="Eliminar del historial">
                <mat-icon class="text-surface-400 text-lg">close</mat-icon>
              </button>
            </div>
          }
        </div>

        @if (hasMore()) {
          <div class="flex justify-center pt-4">
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
export class HistoryComponent implements OnInit {
  private historyService = inject(HistoryService);
  private router = inject(Router);

  history = signal<WatchHistoryItem[]>([]);
  loading = signal(false);
  currentPage = 1;

  hasMore = signal(true);

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.loading.set(true);
    this.historyService.getHistory({ page: this.currentPage }).subscribe({
      next: (items) => {
        if (this.currentPage === 1) {
          this.history.set(items);
        } else {
          this.history.update(h => [...h, ...items]);
        }
        this.hasMore.set(items.length >= 20);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore(): void {
    this.currentPage++;
    this.loadHistory();
  }

  resumeItem(item: WatchHistoryItem): void {
    this.router.navigate(['/player', item.contentId], {
      queryParams: {
        type: item.type,
        resume: item.resumedAt || 0
      }
    });
  }

  deleteItem(id: string): void {
    this.historyService.deleteHistoryItem(id).subscribe({
      next: () => this.history.update(h => h.filter(i => i.id !== id))
    });
  }

  clearAll(): void {
    this.historyService.clearHistory().subscribe({
      next: () => this.history.set([])
    });
  }
}
