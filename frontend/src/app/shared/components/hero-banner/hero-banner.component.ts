import { Component, Input, HostListener, signal, effect, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Movie, Series } from '../../../core/services/content.service';

@Component({
  selector: 'sv-hero-banner',
  template: `
    <div class="relative w-full h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-black"
         [style.height]="height">
      <div #videoContainer class="absolute inset-0 w-full h-full">
        @if (videoUrl && autoPlay) {
          <video #bgVideo
                 class="w-full h-full object-cover opacity-70"
                 [src]="videoUrl"
                 [muted]="true"
                 [autoplay]="true"
                 [loop]="true"
                 playsinline
                 (loadedmetadata)="onVideoLoaded()">
          </video>
        } @else {
          <img [src]="content?.backdropUrl || content?.posterUrl"
               [alt]="content?.title"
               class="w-full h-full object-cover opacity-60"
               loading="eager" />
        }
        <div class="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-surface-900/80 via-transparent to-transparent"></div>
      </div>

      <div class="absolute inset-0 flex items-end pb-20 md:pb-32">
        <div class="content-container w-full">
          <div class="max-w-2xl space-y-4 md:space-y-6 animate-fade-in">
            @if (content?.logoUrl) {
              <img [src]="content?.logoUrl"
                   [alt]="content?.title"
                   class="h-12 md:h-16 lg:h-20 object-contain mb-4"
                   loading="eager" />
            } @else {
              <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                {{ content?.title }}
              </h1>
            }

            <div class="flex items-center gap-4 text-sm md:text-base">
              @if (year) {
                <span class="text-surface-300 font-medium">{{ year }}</span>
              }
              @if (content?.duration) {
                <span class="flex items-center gap-1 text-surface-300">
                  <span class="w-1 h-1 bg-accent rounded-full"></span>
                  {{ content?.duration | duration }}
                </span>
              }
              @if (content?.maturityRating) {
                <span class="px-2 py-0.5 border border-surface-500 text-xs font-medium text-surface-300 rounded">
                  {{ content?.maturityRating }}
                </span>
              }
              @if (content?.rating) {
                <span class="flex items-center gap-1 text-yellow-400 font-semibold">
                  <mat-icon class="text-lg">star</mat-icon>
                  {{ content?.rating }}
                </span>
              }
            </div>

            <p class="text-surface-300 text-sm md:text-base leading-relaxed line-clamp-3 max-w-xl">
              {{ content?.description }}
            </p>

            @if (genres?.length) {
              <div class="flex flex-wrap gap-2">
                @for (genre of genres; track genre) {
                  <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {{ genre }}
                  </span>
                }
              </div>
            }

            <div class="flex items-center gap-3 pt-2">
              <button class="btn-primary flex items-center gap-2 text-lg px-8 py-3 rounded-lg"
                      (click)="onPlay()">
                <mat-icon>play_arrow</mat-icon>
                <span>Reproducir</span>
              </button>
              <button class="btn-secondary flex items-center gap-2 text-lg px-8 py-3 rounded-lg"
                      (click)="onInfo()">
                <mat-icon>info_outline</mat-icon>
                <span>Más información</span>
              </button>
              <button class="btn-ghost p-3 rounded-full"
                      (click)="onToggleFavorite()"
                      matTooltip="Agregar a favoritos">
                <mat-icon>favorite_border</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      @if (showBottomGradient) {
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-900 to-transparent"></div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class HeroBannerComponent implements AfterViewInit {
  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef;

  @Input() content: (Movie | Series) | null = null;
  @Input() videoUrl: string | null = null;
  @Input() autoPlay = true;
  @Input() height = '85vh';
  @Input() showBottomGradient = true;
  @Input() genres: string[] = [];

  @Input() onPlay = () => {};
  @Input() onInfo = () => {};
  @Input() onToggleFavorite = () => {};

  videoLoaded = signal(false);

  get year(): number | null {
    return this.content?.year ?? null;
  }

  ngAfterViewInit(): void {
    if (this.bgVideo && this.autoPlay) {
      this.bgVideo.nativeElement.play().catch(() => {});
    }
  }

  onVideoLoaded(): void {
    this.videoLoaded.set(true);
  }
}
