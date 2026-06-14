import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sv-root',
  template: `
    <div class="min-h-screen flex flex-col bg-surface-900">
      <sv-header (toggleSidebar)="sidebarOpen.set(!sidebarOpen())" />

      <div class="flex flex-1">
        <sv-sidebar [open]="sidebarOpen" (close)="sidebarOpen.set(false)" />
        <main id="main-content" class="w-full min-h-screen pt-[var(--header-height)] lg:w-[calc(100%-var(--sidebar-width))] lg:ml-[var(--sidebar-width)]">
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
