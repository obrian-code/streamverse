import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'sv-search-bar',
  template: `
    <div class="relative w-full"
         (clickOutside)="isOpen.set(false)">
      <div class="relative">
        @if (variant === 'minimal') {
          <button class="btn-ghost p-2 rounded-full"
                  (click)="isOpen.set(!isOpen())"
                  matTooltip="Buscar">
            <mat-icon>search</mat-icon>
          </button>

          @if (isOpen()) {
            <div class="absolute right-0 top-0 w-72 animate-scale-in">
              <div class="glass-panel rounded-xl p-1">
                <input [formControl]="searchControl"
                       type="text"
                       placeholder="Buscar..."
                       class="w-full bg-transparent text-white px-4 py-2.5 text-sm placeholder-surface-400 focus:outline-none"
                       (keydown.escape)="isOpen.set(false)"
                       autofocus />
              </div>
              @if (showSuggestions && suggestions.length > 0 && searchControl.value) {
                <div class="absolute top-full mt-2 left-0 right-0 glass-panel rounded-xl overflow-hidden animate-scale-in z-50">
                  @for (item of suggestions.slice(0, 8); track $index) {
                    <button class="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-700/50 transition-colors text-left"
                            (click)="selectSuggestion(item)">
                      <mat-icon class="text-surface-400 text-lg">search</mat-icon>
                      <span class="text-white text-sm">{{ item }}</span>
                    </button>
                  }
                </div>
              }
            </div>
          }
        } @else {
          <div class="relative">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">search</mat-icon>
            <input [formControl]="searchControl"
                   type="text"
                   [placeholder]="placeholder"
                   class="w-full bg-surface-800 border border-surface-700 rounded-xl
                          pl-10 pr-4 py-3 text-white text-sm placeholder-surface-400
                          focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                          transition-all duration-200"
                   (keydown.escape)="searchControl.setValue('')" />
            @if (searchControl.value) {
              <button class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white"
                      (click)="searchControl.setValue('')">
                <mat-icon class="text-lg">close</mat-icon>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Buscar películas, series, canales...';
  @Input() variant: 'full' | 'minimal' = 'full';
  @Input() suggestions: string[] = [];
  @Input() showSuggestions = true;

  @Output() search = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<string>();

  searchControl = new FormControl('');
  isOpen = signal(false);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value !== null) {
        this.search.emit(value);
      }
    });
  }

  selectSuggestion(item: string): void {
    this.searchControl.setValue(item);
    this.suggestionSelected.emit(item);
    this.isOpen.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
