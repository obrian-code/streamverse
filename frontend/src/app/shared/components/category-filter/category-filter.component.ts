import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'sv-category-filter',
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <button (click)="select(null)"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                     border flex items-center gap-1.5"
              [class.bg-accent]="selectedId() === null"
              [class.text-white]="selectedId() === null"
              [class.border-accent]="selectedId() === null"
              [class.bg-transparent]="selectedId() !== null"
              [class.text-surface-300]="selectedId() !== null"
              [class.border-surface-600]="selectedId() !== null"
              [class.hover:bg-surface-700]="selectedId() !== null"
              [class.hover:text-white]="selectedId() !== null">
        @if (allIcon) {
          <mat-icon class="text-lg mr-1.5">{{ allIcon }}</mat-icon>
        }
        {{ allLabel }}
      </button>

      @for (option of options; track option.id) {
        <button (click)="select(option.id)"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                       border flex items-center gap-1.5"
                [class.bg-accent]="selectedId() === option.id"
                [class.text-white]="selectedId() === option.id"
                [class.border-accent]="selectedId() === option.id"
                [class.bg-transparent]="selectedId() !== option.id"
                [class.text-surface-300]="selectedId() !== option.id"
                [class.border-surface-600]="selectedId() !== option.id"
                [class.hover:bg-surface-700]="selectedId() !== option.id"
                [class.hover:text-white]="selectedId() !== option.id">
          @if (option.icon) {
            <mat-icon class="text-lg">{{ option.icon }}</mat-icon>
          }
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CategoryFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() allLabel = 'Todas';
  @Input() allIcon = 'apps';

  @Output() filterChange = new EventEmitter<string | null>();

  selectedId = signal<string | null>(null);

  select(id: string | null): void {
    this.selectedId.set(id);
    this.filterChange.emit(id);
  }

  reset(): void {
    this.selectedId.set(null);
    this.filterChange.emit(null);
  }
}
