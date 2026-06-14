import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'sv-toast',
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
         aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-xl border animate-slide-in"
             [ngClass]="toastClasses(toast.type)"
             role="alert">
          <mat-icon class="w-5 h-5 flex-shrink-0">{{ iconFor(toast.type) }}</mat-icon>
          <span class="text-sm font-medium flex-1">{{ toast.message }}</span>
          <button (click)="toastService.dismiss(toast.id)"
                  aria-label="Cerrar notificacion"
                  class="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors">
            <mat-icon class="w-4 h-4">close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: contents; }
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  iconFor(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  toastClasses(type: string): Record<string, boolean> {
    return {
      'bg-emerald-900/90 border-emerald-700/50 text-emerald-200': type === 'success',
      'bg-red-900/90 border-red-700/50 text-red-200': type === 'error',
      'bg-amber-900/90 border-amber-700/50 text-amber-200': type === 'warning',
      'bg-sky-900/90 border-sky-700/50 text-sky-200': type === 'info'
    };
  }
}
