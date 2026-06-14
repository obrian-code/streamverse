import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'sv-modal',
  template: `
    @if (open) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
           (click)="closeOnBackdrop && onBackdropClick()">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"
             (click)="closeOnBackdrop && onClose.emit()"></div>

        <div #modalPanel
             role="dialog"
             aria-modal="true"
             [attr.aria-labelledby]="title ? 'modal-title' : null"
             class="relative bg-surface-800 border border-surface-700/50 rounded-2xl shadow-2xl
                    w-full max-w-lg max-h-[90vh] overflow-y-auto
                    animate-modal-in"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between p-6 border-b border-surface-700/50">
            @if (title) {
              <h2 id="modal-title" class="text-xl font-bold text-white">{{ title }}</h2>
            }
            <button (click)="onClose.emit()"
                    aria-label="Cerrar"
                    class="ml-auto p-2 rounded-full hover:bg-surface-700 transition-colors text-surface-400 hover:text-white">
              <mat-icon class="!w-5 !h-5 !text-[20px]">close</mat-icon>
            </button>
          </div>

          <div class="p-6">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes modal-in {
      from { transform: scale(0.95) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
    .animate-modal-in {
      animation: modal-in 0.2s ease-out;
    }
  `]
})
export class ModalComponent {
  @Input({ required: true }) open = false;
  @Input() title?: string;
  @Input() closeOnBackdrop = true;

  @Output() onClose = new EventEmitter<void>();

  @ViewChild('modalPanel') modalPanel?: ElementRef<HTMLElement>;

  private previousActiveElement?: HTMLElement | null;

  constructor() {
    afterNextRender(() => {
      if (this.open) {
        this.previousActiveElement = document.activeElement as HTMLElement;
        setTimeout(() => this.modalPanel?.nativeElement.focus());
      }
    });
  }

  @HostListener('keydown.escape')
  handleEscape(): void {
    if (this.open) {
      this.onClose.emit();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.onClose.emit();
    }
  }
}
