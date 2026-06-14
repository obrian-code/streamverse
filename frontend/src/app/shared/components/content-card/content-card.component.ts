import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MediaItem, Series } from '../../../core/services/content.service';

@Component({
  selector: 'sv-content-card',
  template: `
    <div class="group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300
                hover:scale-105 hover:shadow-2xl hover:shadow-black/40 hover:z-10"
         [class.w-full]="!width"
         [style.width]="width"
         (click)="onClick.emit(content)"
         (mouseenter)="hovered = true"
         (mouseleave)="hovered = false">

      <div class="relative aspect-[2/3] overflow-hidden bg-surface-800">
        <img [src]="content?.posterUrl"
             [alt]="content?.title"
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             loading="lazy" />

        <div class="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        @if (content?.featured) {
          <div class="absolute top-2 left-2">
            <span class="px-2 py-0.5 bg-accent text-white text-[10px] font-bold uppercase rounded">
              Destacado
            </span>
          </div>
        }

        @if (content?.maturityRating) {
          <div class="absolute top-2 right-2">
            <span class="px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded">
              {{ content?.maturityRating }}
            </span>
          </div>
        }

        @if (showProgress !== undefined && showProgress > 0) {
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-surface-700">
            <div class="h-full bg-accent transition-all duration-300"
                 [style.width.%]="showProgress"></div>
          </div>
        }
      </div>

      <div class="p-2.5 space-y-1.5">
        <h3 class="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">
          {{ content?.title }}
        </h3>

        <div class="flex items-center gap-2 text-xs text-surface-400">
          @if (content?.year) {
            <span>{{ content?.year }}</span>
          }
          @if (content?.rating) {
            <span class="flex items-center gap-0.5 text-yellow-400">
              <mat-icon class="text-xs !w-3 !h-3 !text-[12px]">star</mat-icon>
              {{ content?.rating }}
            </span>
          }
        </div>
      </div>

      @if (hovered) {
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center
                      transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <mat-icon class="text-white !w-8 !h-8 !text-[32px]">play_arrow</mat-icon>
          </div>
        </div>
      }

      @if (isSeriesWithEpisodes(content)) {
        <div class="absolute bottom-12 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="px-2 py-0.5 bg-primary-600/90 text-white text-[10px] rounded">
            {{ getSeriesEpisodeCount(content) }} episodios
          </span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class ContentCardComponent {
  @Input() content!: MediaItem;
  @Input() width?: string;
  @Input() showProgress?: number;

  @Output() onClick = new EventEmitter<MediaItem>();

  hovered = false;

  isSeriesWithEpisodes(item: MediaItem): boolean {
    return item.type === 'series' && 'episodes' in item;
  }

  getSeriesEpisodeCount(item: MediaItem): number {
    return (item as Series).episodes || 0;
  }
}
