import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sv-root',
  template: `
    <div class="min-h-screen flex flex-col bg-surface-900">
      <sv-header (toggleSidebar)="sidebarOpen.set(!sidebarOpen())" />

      <div class="flex flex-1">
        <sv-sidebar [open]="sidebarOpen" (close)="sidebarOpen.set(false)" />
        <main id="main-content" class="flex-1 min-h-screen pt-[var(--header-height)] lg:ml-0">
          <router-outlet />
        </main>
      </div>

      <sv-footer />
    </div>

    <sv-toast />
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class AppComponent {
  sidebarOpen = signal(false);
}
