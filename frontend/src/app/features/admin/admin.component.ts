import { Component, OnInit, signal, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'sv-admin',
  template: `
    <div class="content-container py-8 space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl md:text-4xl font-bold text-white">Panel de Administración</h1>
        <p class="text-surface-400">Gestiona usuarios, canales y contenido de la plataforma</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats(); track stat.label) {
          <div class="card p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                   [ngClass]="{
                     'bg-accent/20': stat.color === 'accent',
                     'bg-primary-500/20': stat.color === 'primary',
                     'bg-green-500/20': stat.color === 'green',
                     'bg-yellow-500/20': stat.color === 'yellow'
                   }">
                <mat-icon class="text-xl"
                          [class.text-accent]="stat.color === 'accent'"
                          [class.text-primary-400]="stat.color === 'primary'"
                          [class.text-green-400]="stat.color === 'green'"
                          [class.text-yellow-400]="stat.color === 'yellow'">
                  {{ stat.icon }}
                </mat-icon>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
                <p class="text-xs text-surface-400">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="flex gap-2 border-b border-surface-800">
        @for (tab of tabs; track tab.id) {
          <button (click)="activeTab.set(tab.id)"
                  class="px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
                  [class.text-accent]="activeTab() === tab.id"
                  [class.border-accent]="activeTab() === tab.id"
                  [class.text-surface-400]="activeTab() !== tab.id"
                  [class.border-transparent]="activeTab() !== tab.id"
                  [class.hover:text-white]="activeTab() !== tab.id">
            {{ tab.label }}
          </button>
        }
      </div>

      @switch (activeTab()) {
        @case ('users') {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-surface-400 text-xs uppercase tracking-wider">
                  <th class="text-left p-3">Usuario</th>
                  <th class="text-left p-3">Email</th>
                  <th class="text-left p-3">Rol</th>
                  <th class="text-left p-3">Estado</th>
                  <th class="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (user of mockUsers; track user.id) {
                  <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td class="p-3">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
                          <mat-icon class="text-surface-400 text-sm">person</mat-icon>
                        </div>
                        <span class="text-white font-medium">{{ user.username }}</span>
                      </div>
                    </td>
                    <td class="p-3 text-surface-400">{{ user.email }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 text-xs rounded-full"
                            [ngClass]="{
                              'bg-primary-600/20 text-primary-400': user.role === 'admin',
                              'bg-surface-700 text-surface-300': user.role === 'user'
                            }">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="p-3">
                      <span class="flex items-center gap-1.5 text-xs"
                            [class.text-green-400]="user.active">
                        <span class="w-1.5 h-1.5 rounded-full"
                              [class.bg-green-400]="user.active"
                              [class.bg-surface-500]="!user.active">
                        </span>
                        {{ user.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="p-3">
                      <button class="btn-ghost p-1.5 text-surface-400 hover:text-white">
                        <mat-icon class="text-lg">edit</mat-icon>
                      </button>
                      <button class="btn-ghost p-1.5 text-surface-400 hover:text-accent">
                        <mat-icon class="text-lg">block</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        @case ('content') {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-surface-400 text-xs uppercase tracking-wider">
                  <th class="text-left p-3">Título</th>
                  <th class="text-left p-3">Tipo</th>
                  <th class="text-left p-3">Año</th>
                  <th class="text-left p-3">Rating</th>
                  <th class="text-left p-3">Estado</th>
                  <th class="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (content of mockContent; track content.id) {
                  <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td class="p-3 text-white font-medium">{{ content.title }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 text-xs rounded-full"
                            [ngClass]="{
                              'bg-accent/20 text-accent': content.type === 'movie',
                              'bg-primary-600/20 text-primary-400': content.type === 'series'
                            }">
                        {{ content.type === 'movie' ? 'Película' : 'Serie' }}
                      </span>
                    </td>
                    <td class="p-3 text-surface-400">{{ content.year }}</td>
                    <td class="p-3 text-yellow-400">{{ content.rating }}</td>
                    <td class="p-3">
                      <span class="flex items-center gap-1.5 text-xs"
                            [class.text-green-400]="content.active">
                        <span class="w-1.5 h-1.5 rounded-full"
                              [class.bg-green-400]="content.active"
                              [class.bg-surface-500]="!content.active">
                        </span>
                        {{ content.active ? 'Publicado' : 'Borrador' }}
                      </span>
                    </td>
                    <td class="p-3">
                      <button class="btn-ghost p-1.5 text-surface-400 hover:text-white">
                        <mat-icon class="text-lg">edit</mat-icon>
                      </button>
                      <button class="btn-ghost p-1.5 text-surface-400 hover:text-accent">
                        <mat-icon class="text-lg">delete</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        @case ('channels') {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-surface-400 text-xs uppercase tracking-wider">
                  <th class="text-left p-3">Canal</th>
                  <th class="text-left p-3">Categoría</th>
                  <th class="text-left p-3">Estado</th>
                  <th class="text-left p-3">Visitas</th>
                  <th class="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (channel of mockChannels; track channel.id) {
                  <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td class="p-3">
                      <div class="flex items-center gap-2">
                        <span class="text-white font-medium">{{ channel.name }}</span>
                      </div>
                    </td>
                    <td class="p-3 text-surface-400">{{ channel.category }}</td>
                    <td class="p-3">
                      <span class="flex items-center gap-1.5 text-xs"
                            [class.text-green-400]="channel.live">
                        <span class="w-1.5 h-1.5 rounded-full animate-pulse"
                              [class.bg-green-400]="channel.live"
                              [class.bg-surface-500]="!channel.live">
                        </span>
                        {{ channel.live ? 'En vivo' : 'Offline' }}
                      </span>
                    </td>
                    <td class="p-3 text-surface-400">{{ channel.views }}</td>
                    <td class="p-3">
                      <button class="btn-ghost p-1.5 text-surface-400 hover:text-white">
                        <mat-icon class="text-lg">settings</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class AdminComponent implements OnInit {
  auth = inject(AuthService);
  private contentService = inject(ContentService);

  activeTab = signal('users');

  tabs = [
    { id: 'users', label: 'Usuarios' },
    { id: 'content', label: 'Contenido' },
    { id: 'channels', label: 'Canales' }
  ];

  stats = signal([
    { label: 'Usuarios totales', value: '12,450', icon: 'people', color: 'accent' },
    { label: 'Contenidos', value: '3,842', icon: 'movie', color: 'primary' },
    { label: 'Canales', value: '48', icon: 'live_tv', color: 'green' },
    { label: 'Reproducciones hoy', value: '18.2K', icon: 'trending_up', color: 'yellow' }
  ]);

  mockUsers = [
    { id: '1', username: 'admin', email: 'admin@streamverse.com', role: 'admin', active: true },
    { id: '2', username: 'johndoe', email: 'john@example.com', role: 'user', active: true },
    { id: '3', username: 'janedoe', email: 'jane@example.com', role: 'user', active: true },
    { id: '4', username: 'streamfan', email: 'fan@example.com', role: 'user', active: false },
    { id: '5', username: 'movielover', email: 'lover@example.com', role: 'user', active: true }
  ];

  mockContent = [
    { id: '1', title: 'Dune: Part Two', type: 'movie', year: 2024, rating: '8.9', active: true },
    { id: '2', title: 'The Last of Us', type: 'series', year: 2023, rating: '9.2', active: true },
    { id: '3', title: 'Oppenheimer', type: 'movie', year: 2023, rating: '8.5', active: true },
    { id: '4', title: 'Stranger Things', type: 'series', year: 2022, rating: '8.7', active: true },
    { id: '5', title: 'The Boys', type: 'series', year: 2024, rating: '8.8', active: false }
  ];

  mockChannels = [
    { id: '1', name: 'StreamVerse One', category: 'Entretenimiento', live: true, views: '12.5K' },
    { id: '2', name: 'Sports Plus', category: 'Deportes', live: true, views: '8.2K' },
    { id: '3', name: 'News 24/7', category: 'Noticias', live: true, views: '15.1K' },
    { id: '4', name: 'Cine Classics', category: 'Películas', live: false, views: '4.3K' },
    { id: '5', name: 'Music Channel', category: 'Música', live: true, views: '6.7K' }
  ];

  ngOnInit(): void {}
}
