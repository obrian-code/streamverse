import { Component } from '@angular/core';

@Component({
  selector: 'sv-footer',
  template: `
    <footer class="bg-surface-950 border-t border-surface-800/50 mt-auto">
      <div class="content-container py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="space-y-4">
            <a routerLink="/" class="text-2xl font-extrabold gradient-text">StreamVerse</a>
            <p class="text-surface-400 text-sm leading-relaxed">
              Tu plataforma de streaming todo en uno. Disfruta de TV en vivo, películas y series en cualquier momento y lugar.
            </p>
            <div class="flex items-center gap-3">
              <a href="https://facebook.com/streamverse" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                 class="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors">
                <span class="text-surface-400 text-sm font-bold">FB</span>
              </a>
              <a href="https://twitter.com/streamverse" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                 class="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors">
                <span class="text-surface-400 text-sm font-bold">TW</span>
              </a>
              <a href="https://instagram.com/streamverse" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 class="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors">
                <span class="text-surface-400 text-sm font-bold">IG</span>
              </a>
              <a href="https://youtube.com/@streamverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                 class="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors">
                <span class="text-surface-400 text-sm font-bold">YT</span>
              </a>
            </div>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4">Navegación</h4>
            <ul class="space-y-2.5">
              <li><a routerLink="/" class="text-surface-400 hover:text-white text-sm transition-colors">Inicio</a></li>
              <li><a routerLink="/tv-live" class="text-surface-400 hover:text-white text-sm transition-colors">TV en Vivo</a></li>
              <li><a routerLink="/movies" class="text-surface-400 hover:text-white text-sm transition-colors">Películas</a></li>
              <li><a routerLink="/series" class="text-surface-400 hover:text-white text-sm transition-colors">Series</a></li>
              <li><a routerLink="/search" class="text-surface-400 hover:text-white text-sm transition-colors">Buscar</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4">Ayuda</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Centro de ayuda</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Términos de servicio</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Política de privacidad</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Preferencias de cookies</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Avisos legales</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4">Descarga</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">iOS App</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Android App</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Smart TV</a></li>
              <li><a href="#" class="text-surface-400 hover:text-white text-sm transition-colors">Web App</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-surface-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-surface-500 text-xs">
            &copy; {{ currentYear }} StreamVerse. Todos los derechos reservados.
          </p>
          <div class="flex items-center gap-4 text-xs text-surface-500">
            <span>{{ version }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  version = 'v1.0.0';
}
