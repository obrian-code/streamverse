import { Component, Input, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { MediaItem } from '../../../core/services/content.service';

@Component({
  selector: 'sv-content-row',
  template: `
    <div class="relative group/row">
      @if (title) {
        <div class="flex items-center justify-between mb-4 px-4 md:px-8">
          <h2 class="text-xl md:text-2xl font-bold text-white hover:text-primary-300 transition-colors cursor-pointer">
            {{ title }}
          </h2>
          @if (viewAllLink) {
            <a [routerLink]="viewAllLink"
               class="text-sm text-surface-400 hover:text-white transition-colors flex items-center gap-1">
              Ver todo
              <mat-icon class="text-lg">arrow_forward</mat-icon>
            </a>
          }
        </div>
      }

      <div class="relative">
        @if (showArrows && canScrollLeft()) {
          <button (click)="scrollLeft()"
                  class="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16
                         bg-gradient-to-r from-surface-900/90 to-transparent
                         flex items-center justify-start pl-2
                         opacity-0 group-hover/row:opacity-100 transition-opacity duration-300
                         hover:from-surface-900">
            <mat-icon class="text-white text-3xl">chevron_left</mat-icon>
          </button>
        }

        <div #scrollContainer
             class="flex gap-2 md:gap-3 overflow-x-auto scroll-smooth pb-2 px-4 md:px-8"
             (scroll)="onScroll()">
          @for (item of items; track item.id) {
            <div class="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
              <sv-content-card
                [content]="item"
                (onClick)="onItemClick($event)" />
            </div>
          }

          @if (loading) {
            @for (_ of [].constructor(6); track _) {
              <div class="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
                <div class="aspect-[2/3] skeleton rounded-lg"></div>
                <div class="mt-2 space-y-1.5">
                  <div class="h-4 skeleton rounded w-3/4"></div>
                  <div class="h-3 skeleton rounded w-1/2"></div>
                </div>
              </div>
            }
          }
        </div>

        @if (showArrows && canScrollRight()) {
          <button (click)="scrollRight()"
                  class="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16
                         bg-gradient-to-l from-surface-900/90 to-transparent
                         flex items-center justify-end pr-2
                         opacity-0 group-hover/row:opacity-100 transition-opacity duration-300
                         hover:from-surface-900">
            <mat-icon class="text-white text-3xl">chevron_right</mat-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .overflow-x-auto {
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar { display: none; }
    }
  `]
})
export class ContentRowComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  @Input() title = '';
  @Input() items: MediaItem[] = [];
  @Input() viewAllLink?: string;
  @Input() showArrows = true;
  @Input() loading = false;

  @Input() onItemClick: (item: MediaItem) => void = () => {};

  canScrollLeft = signal(false);
  canScrollRight = signal(true);

  ngAfterViewInit(): void {
    this.checkScroll();
  }

  onScroll(): void {
    this.checkScroll();
  }

  scrollLeft(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  private checkScroll(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    this.canScrollLeft.set(el.scrollLeft > 10);
    this.canScrollRight.set(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }
}
