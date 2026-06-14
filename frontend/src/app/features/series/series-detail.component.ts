import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, Series, Season, Episode } from '../../core/services/content.service';

@Component({
  selector: 'sv-series-detail',
  template: `
    @if (series(); as s) {
      <div class="relative">
        <div class="h-[50vh] min-h-[400px] relative overflow-hidden">
          <img [src]="s.backdropUrl || s.posterUrl"
               [alt]="s.title"
               class="w-full h-full object-cover opacity-50" />
          <div class="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent"></div>

          <div class="absolute bottom-0 left-0 right-0 content-container pb-8">
            <div class="flex items-end gap-6">
              <img [src]="s.posterUrl"
                   [alt]="s.title"
                   class="w-32 md:w-40 rounded-lg shadow-2xl hidden sm:block" />
              <div class="space-y-3">
                <h1 class="text-3xl md:text-5xl font-bold text-white">{{ s.title }}</h1>
                <div class="flex items-center gap-3 text-sm text-surface-300">
                  <span>{{ s.year }}</span>
                  <span class="w-1 h-1 bg-accent rounded-full"></span>
                  <span>{{ s.seasons }} {{ s.seasons === 1 ? 'temporada' : 'temporadas' }}</span>
                  <span class="w-1 h-1 bg-accent rounded-full"></span>
                  <span>{{ s.episodes }} episodios</span>
                  @if (s.rating) {
                    <span class="flex items-center gap-1 text-yellow-400">
                      <mat-icon class="text-lg">star</mat-icon>
                      {{ s.rating }}
                    </span>
                  }
                </div>
                <p class="text-surface-300 text-sm max-w-2xl leading-relaxed">{{ s.description }}</p>
                <div class="flex items-center gap-3">
                  <button class="btn-primary flex items-center gap-2" (click)="playFirstEpisode()">
                    <mat-icon>play_arrow</mat-icon>
                    Reproducir
                  </button>
                  <button class="btn-secondary flex items-center gap-2">
                    <mat-icon>playlist_add</mat-icon>
                    Mi lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-container py-8 space-y-6">
          @if (s.genres?.length) {
            <div class="flex flex-wrap gap-2">
              @for (genre of s.genres; track genre.id) {
                <span class="px-3 py-1 bg-surface-800 text-surface-300 text-xs rounded-full border border-surface-700">
                  {{ genre.name }}
                </span>
              }
            </div>
          }

          @if (s.cast?.length) {
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Reparto</h3>
              <div class="flex gap-4 overflow-x-auto pb-2">
                @for (member of s.cast; track member.id) {
                  <div class="flex-shrink-0 text-center w-20">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-surface-700 mx-auto mb-1">
                      @if (member.photoUrl) {
                        <img [src]="member.photoUrl" [alt]="member.name" class="w-full h-full object-cover" />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center text-surface-500">
                          <mat-icon>person</mat-icon>
                        </div>
                      }
                    </div>
                    <p class="text-xs text-white truncate">{{ member.name }}</p>
                    <p class="text-[10px] text-surface-400 truncate">{{ member.role }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Episodios</h3>

            <div class="flex gap-2 mb-4 overflow-x-auto">
              @for (season of seasons(); track season.id) {
                <button (click)="selectSeason(season)"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                        [class.bg-accent]="selectedSeason()?.id === season.id"
                        [class.text-white]="selectedSeason()?.id === season.id"
                        [class.bg-surface-800]="selectedSeason()?.id !== season.id"
                        [class.text-surface-300]="selectedSeason()?.id !== season.id">
                  {{ season.title || 'Temporada ' + season.seasonNumber }}
                </button>
              }
            </div>

            <div class="space-y-2">
              @for (episode of currentEpisodes(); track episode.id) {
                <div class="flex gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-surface-800/50"
                     (click)="playEpisode(episode)">
                  <div class="relative flex-shrink-0 w-40 md:w-48 aspect-video rounded-lg overflow-hidden bg-surface-800">
                    <img [src]="episode.thumbnailUrl || s.posterUrl"
                         [alt]="episode.title"
                         class="w-full h-full object-cover" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <mat-icon class="text-white text-3xl">play_circle</mat-icon>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-medium text-surface-400">
                        {{ episode.episodeNumber }}. {{ episode.title }}
                      </span>
                      @if (episode.duration) {
                        <span class="text-xs text-surface-500 ml-auto">{{ episode.duration | duration }}</span>
                      }
                    </div>
                    <p class="text-sm text-surface-400 line-clamp-2">{{ episode.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center min-h-screen">
        <mat-spinner diameter="48" strokeWidth="4"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class SeriesDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);

  series = signal<Series | null>(null);
  seasons = signal<Season[]>([]);
  selectedSeason = signal<Season | null>(null);
  currentEpisodes = signal<Episode[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contentService.getSeriesById(id).subscribe({
        next: (series) => {
          this.series.set(series);
          this.loadSeasons(series.id);
        }
      });
    }
  }

  private loadSeasons(seriesId: string): void {
    this.contentService.getSeasons(seriesId).subscribe({
      next: (seasons) => {
        this.seasons.set(seasons);
        if (seasons.length > 0) {
          this.selectSeason(seasons[0]);
        }
      }
    });
  }

  selectSeason(season: Season): void {
    this.selectedSeason.set(season);
    this.contentService.getEpisodes(season.seriesId, season.id).subscribe({
      next: (episodes) => this.currentEpisodes.set(episodes)
    });
  }

  playFirstEpisode(): void {
    const episodes = this.currentEpisodes();
    if (episodes.length > 0) {
      this.playEpisode(episodes[0]);
    }
  }

  playEpisode(episode: Episode): void {
    const s = this.series();
    if (s) {
      this.router.navigate(['/player', episode.id], {
        queryParams: {
          type: 'episode',
          seriesId: s.id,
          title: episode.title,
          subtitle: `${s.title} - ${episode.episodeNumber}x${episode.episodeNumber}`
        }
      });
    }
  }
}
