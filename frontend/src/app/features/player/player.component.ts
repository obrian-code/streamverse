import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { HistoryService } from '../../core/services/history.service';
import { Location } from '@angular/common';

@Component({
  selector: 'sv-player',
  template: `
    <div class="fixed inset-0 z-50 bg-black flex flex-col">
      <div class="flex-1 relative">
        @if (sources().length > 0) {
          <sv-video-player
            [sources]="sources()"
            [currentTitle]="title()"
            [currentSubtitle]="subtitle()"
            [showInfo]="true"
            [autoplay]="true"
            [startPosition]="resumePosition()"
            [onBack]="goBack.bind(this)"
            [onTimeUpdate]="onTimeUpdate.bind(this)"
            [onEnded]="onEnded.bind(this)"
            containerClass="h-full" />
        } @else {
          <div class="flex items-center justify-center h-full">
            <div class="text-center space-y-4">
              <mat-spinner diameter="48" strokeWidth="4"></mat-spinner>
              <p class="text-surface-400">Cargando contenido...</p>
            </div>
          </div>
        }
      </div>

      @if (showInfoPanel()) {
        <div class="absolute top-0 right-0 h-full w-96 bg-surface-950/95 backdrop-blur-xl border-l border-surface-800/50
                    transform transition-transform duration-300 overflow-y-auto"
             [class.translate-x-0]="showInfoPanel()"
             class="hidden lg:block">
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-white">Información</h3>
              <button class="btn-ghost p-1" (click)="showInfoPanel.set(false)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <img [src]="posterUrl()" alt="" class="w-full rounded-lg" />
            <p class="text-sm text-surface-300 leading-relaxed">{{ description() }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class PlayerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private contentService = inject(ContentService);
  private historyService = inject(HistoryService);

  sources = signal<{ src: string; type: string }[]>([]);
  title = signal('');
  subtitle = signal('');
  description = signal('');
  posterUrl = signal('');
  resumePosition = signal(0);
  showInfoPanel = signal(false);

  private contentId = '';
  private contentType = '';
  private historyItemId: string | null = null;

  ngOnInit(): void {
    this.contentId = this.route.snapshot.paramMap.get('id') || '';
    this.contentType = this.route.snapshot.queryParams['type'] || 'movie';
    const resume = parseFloat(this.route.snapshot.queryParams['resume'] || '0');
    this.showInfoPanel.set(this.route.snapshot.queryParams['info'] === 'true');
    const episodeTitle = this.route.snapshot.queryParams['title'] || '';
    const episodeSub = this.route.snapshot.queryParams['subtitle'] || '';

    if (resume > 0) {
      this.resumePosition.set(resume);
    }

    if (this.contentType === 'movie') {
      this.contentService.getMovie(this.contentId).subscribe({
        next: (movie) => {
          this.title.set(episodeTitle || movie.title);
          this.subtitle.set(episodeSub || movie.year?.toString() || '');
          this.description.set(movie.description);
          this.posterUrl.set(movie.posterUrl);
          if (movie.videoUrl) {
            this.sources.set([{ src: movie.videoUrl, type: 'application/x-mpegURL' }]);
          }
        }
      });
    } else if (this.contentType === 'episode') {
      const seriesId = this.route.snapshot.queryParams['seriesId'] || '';
      this.contentService.getEpisode(seriesId, '', this.contentId).subscribe({
        next: (episode) => {
          this.title.set(episodeTitle || episode.title);
          this.subtitle.set(episodeSub || `Episodio ${episode.episodeNumber}`);
          this.description.set(episode.description);
          this.posterUrl.set(episode.thumbnailUrl);
          if (episode.videoUrl) {
            this.sources.set([{ src: episode.videoUrl, type: 'application/x-mpegURL' }]);
          }
        }
      });
    }
  }

  onTimeUpdate(currentTime: number, duration: number): void {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    this.historyService.addToHistory({
      contentId: this.contentId,
      type: this.contentType as any,
      progress,
      duration,
      resumedAt: Math.floor(currentTime)
    }).subscribe({
      next: (res) => {
        if ((res as any)?.id) {
          this.historyItemId = (res as any).id;
        }
      }
    });
  }

  onEnded(): void {
    // Auto-close player or show next episode suggestion
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    // Save final position if needed
  }
}
