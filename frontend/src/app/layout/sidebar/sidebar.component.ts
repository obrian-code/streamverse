import { Component, Input, Output, EventEmitter, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'sv-sidebar',
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-40 lg:hidden" (click)="onClose()">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
    }

    <aside class="fixed top-0 left-0 z-50 h-full w-[var(--sidebar-width)] bg-surface-950/95 backdrop-blur-xl
                  border-r border-surface-800/50 transform transition-transform duration-300 ease-out
                  lg:translate-x-0 lg:static lg:z-auto"
           [class.translate-x-0]="isOpen()"
           [class.-translate-x-full]="!isOpen()">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-6 h-[var(--header-height)] border-b border-surface-800/50">
          <a routerLink="/" class="text-xl font-extrabold gradient-text" (click)="onClose()">StreamVerse</a>
          <button class="btn-ghost p-2 lg:hidden" (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          @for (item of menuItems; track item.path) {
            <a [routerLink]="item.path"
               (click)="onClose()"
               routerLinkActive="bg-surface-800/80 text-white border-l-accent"
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      text-surface-300 hover:text-white hover:bg-surface-800/50
                      border-l-2 border-transparent transition-all duration-200">
              <mat-icon class="text-lg">{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
              @if (item.badge) {
                <span class="ml-auto px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">
                  {{ item.badge }}
                </span>
              }
            </a>
          }

          @if (auth.isAdmin()) {
            <div class="pt-4 mt-4 border-t border-surface-800/50">
              <p class="px-4 text-[10px] font-semibold uppercase tracking-widest text-surface-500 mb-2">Administración</p>
              <a routerLink="/admin"
                 (click)="onClose()"
                 routerLinkActive="bg-surface-800/80 text-white border-l-accent"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                        text-surface-300 hover:text-white hover:bg-surface-800/50
                        border-l-2 border-transparent transition-all duration-200">
                <mat-icon class="text-lg">admin_panel_settings</mat-icon>
                <span>Panel Admin</span>
              </a>
            </div>
          }
        </nav>

        @if (auth.isAuthenticated()) {
          <div class="p-3 border-t border-surface-800/50">
            <a routerLink="/profile"
               (click)="onClose()"
               class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-800/50 transition-colors">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center flex-shrink-0">
                @if (auth.currentUser()?.avatar) {
                  <img [src]="auth.currentUser()?.avatar" alt="" class="w-full h-full object-cover" />
                } @else {
                  <mat-icon class="text-white text-lg">person</mat-icon>
                }
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ auth.currentUser()?.username }}</p>
                <p class="text-xs text-surface-400 truncate">{{ auth.currentUser()?.email }}</p>
              </div>
            </a>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class SidebarComponent {
  @Input({ alias: 'open' }) isOpen = signal(false);
  @Output() close = new EventEmitter<void>();

  menuItems: { path: string; label: string; icon: string; badge?: string }[] = [
    { path: '/', label: 'Inicio', icon: 'home' },
    { path: '/tv-live', label: 'TV en Vivo', icon: 'live_tv' },
    { path: '/movies', label: 'Películas', icon: 'movie' },
    { path: '/series', label: 'Series', icon: 'tv' },
    { path: '/favorites', label: 'Favoritos', icon: 'favorite' },
    { path: '/history', label: 'Historial', icon: 'history' },
    { path: '/search', label: 'Buscar', icon: 'search' }
  ];

  constructor(public auth: AuthService) {}

  onClose(): void {
    this.close.emit();
  }
}
