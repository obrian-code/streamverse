import { Component, HostListener, signal, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'sv-header',
  template: `
    <header class="fixed top-0 left-0 z-50 w-full transition-all duration-300 lg:w-[calc(100%-var(--sidebar-width))] lg:left-[var(--sidebar-width)]"
            [ngClass]="{
              'bg-surface-900/95': isScrolled(),
              'backdrop-blur-xl': isScrolled(),
              'border-b border-surface-800': isScrolled(),
              'bg-transparent': !isScrolled()
            }">
      <div class="content-container flex items-center justify-between h-[var(--header-height)]">
        <div class="flex items-center gap-8">
          <button class="lg:hidden btn-ghost p-2 -ml-2"
                  (click)="toggleSidebar.emit()">
            <mat-icon>menu</mat-icon>
          </button>

          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-2xl font-extrabold gradient-text tracking-tight">StreamVerse</span>
          </a>

          <nav class="hidden lg:flex items-center gap-1">
            @for (link of navLinks; track link.path) {
              <a [routerLink]="link.path"
                 routerLinkActive="text-white bg-surface-800/50"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white
                        hover:bg-surface-800/30 rounded-lg transition-all duration-200">
                @if (link.icon) {
                  <mat-icon class="text-lg mr-1.5 align-text-bottom">{{ link.icon }}</mat-icon>
                }
                {{ link.label }}
              </a>
            }
          </nav>
        </div>

        <div class="flex items-center gap-2">
          @if (auth.isAuthenticated()) {
            <sv-search-bar variant="minimal"
                          [suggestions]="searchSuggestions"
                          (search)="onSearch($event)"
                          class="hidden sm:block" />

            <button class="btn-ghost p-2 rounded-full relative"
                    matTooltip="Notificaciones">
              <mat-icon>notifications_outline</mat-icon>
              @if (notificationCount > 0) {
                <span class="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full
                             text-[10px] font-bold flex items-center justify-center text-white">
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              }
            </button>

            <div class="relative" [matMenuTriggerFor]="userMenu">
              <button class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-800 transition-colors">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center">
                  @if (auth.currentUser()?.avatar) {
                    <img [src]="auth.currentUser()?.avatar" alt="Avatar"
                         class="w-full h-full object-cover" />
                  } @else {
                    <mat-icon class="text-white text-lg">person</mat-icon>
                  }
                </div>
                <mat-icon class="text-surface-400 hidden md:block text-lg">expand_more</mat-icon>
              </button>
            </div>

            <mat-menu #userMenu="matMenu" class="mt-2">
              <button mat-menu-item routerLink="/profile" class="!flex !items-center !gap-3">
                <mat-icon class="text-surface-400">person</mat-icon>
                <span>Perfil</span>
              </button>
              <button mat-menu-item routerLink="/favorites" class="!flex !items-center !gap-3">
                <mat-icon class="text-surface-400">favorite</mat-icon>
                <span>Favoritos</span>
              </button>
              <button mat-menu-item routerLink="/history" class="!flex !items-center !gap-3">
                <mat-icon class="text-surface-400">history</mat-icon>
                <span>Historial</span>
              </button>
              @if (auth.isAdmin()) {
                <button mat-menu-item routerLink="/admin" class="!flex !items-center !gap-3">
                  <mat-icon class="text-surface-400">admin_panel_settings</mat-icon>
                  <span>Admin</span>
                </button>
              }
              <mat-divider class="!bg-surface-700"></mat-divider>
              <button mat-menu-item (click)="logout()" class="!flex !items-center !gap-3">
                <mat-icon class="text-surface-400">logout</mat-icon>
                <span>Cerrar sesión</span>
              </button>
            </mat-menu>
          } @else {
            <a routerLink="/auth/login" class="btn-secondary text-sm px-4 py-2 inline-flex items-center">Iniciar sesión</a>
            <a routerLink="/auth/register" class="btn-primary text-sm px-4 py-2 inline-flex items-center">Registrarse</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class HeaderComponent {
  isScrolled = signal(false);
  notificationCount = 0;
  searchSuggestions: string[] = [];

  navLinks = [
    { path: '/', label: 'Inicio', icon: 'home' },
    { path: '/tv-live', label: 'TV en Vivo', icon: 'live_tv' },
    { path: '/movies', label: 'Películas', icon: 'movie' },
    { path: '/series', label: 'Series', icon: 'tv' },
    { path: '/search', label: 'Buscar', icon: 'search' }
  ];

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
