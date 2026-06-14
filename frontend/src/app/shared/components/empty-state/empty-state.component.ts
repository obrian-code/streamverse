import { Component, Input } from '@angular/core';

@Component({
  selector: 'sv-empty-state',
  template: `
    <div class="flex flex-col items-center justify-center py-16 md:py-20 space-y-4" role="status">
      <mat-icon class="text-5xl md:text-6xl !w-16 !h-16 text-surface-600">
        {{ icon }}
      </mat-icon>
      <h3 class="text-xl md:text-2xl font-semibold text-surface-300 text-center">
        {{ title }}
      </h3>
      @if (message) {
        <p class="text-surface-500 text-sm md:text-base text-center max-w-md">
          {{ message }}
        </p>
      }
      <ng-content select="[actions]" />
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class EmptyStateComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input() message?: string;
}
