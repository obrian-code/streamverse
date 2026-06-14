import { Component, OnInit, signal, computed } from '@angular/core';
import { Channel, EpgProgram, ContentService } from '../../core/services/content.service';
import { StreamingService } from '../../core/services/streaming.service';

@Component({
  selector: 'sv-tv-live',
  template: `
    <div class="min-h-screen bg-black">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-1 relative bg-black" [style.min-height]="'var(--player-min-height)'">
          @if (selectedChannel(); as channel) {
            <sv-video-player
              [sources]="[{src: channel.streamUrl, type: 'application/x-mpegURL'}]"
              [currentTitle]="channel.name"
              [currentSubtitle]="channel.currentProgram?.title || ''"
              [autoplay]="true"
              [showInfo]="false"
              containerClass="h-full"
              aspectRatio="16/9" />
          } @else {
            <div class="absolute inset-0 flex items-center justify-center bg-surface-950">
              <div class="text-center space-y-4">
                <mat-icon class="text-6xl text-surface-600">live_tv</mat-icon>
                <h2 class="text-2xl text-surface-400">Selecciona un canal</h2>
                <p class="text-surface-500 text-sm">Elige un canal de la lista para comenzar a ver</p>
              </div>
            </div>
          }

          <div class="absolute top-4 left-4 z-10">
            <div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span class="text-white text-xs font-medium uppercase tracking-wider">EN VIVO</span>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-96 xl:w-[420px] bg-surface-950 border-l border-surface-800/50 flex flex-col">
          <div class="p-4 border-b border-surface-800/50">
            <div class="flex items-center gap-2 mb-3">
              <mat-icon class="text-accent">live_tv</mat-icon>
              <h2 class="text-lg font-bold text-white">Canales</h2>
            </div>
            <input type="text" placeholder="Buscar canales..."
                   [(ngModel)]="searchQuery"
                   class="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white placeholder-surface-400 focus:border-primary-500" />
          </div>

          <div class="flex-1 overflow-y-auto">
            @for (category of channelCategories(); track category) {
              <div class="px-4 py-3">
                <h3 class="text-[11px] font-semibold uppercase tracking-widest text-surface-500 mb-2">{{ category }}</h3>
                @for (channel of getChannelsByCategory(category); track channel.id) {
                  <button (click)="selectChannel(channel)"
                          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                          [class.bg-surface-800]="selectedChannel()?.id === channel.id"
                          [ngClass]="{'hover:bg-surface-800/50': selectedChannel()?.id !== channel.id}">
                    <div class="w-10 h-10 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0 flex items-center justify-center">
                      @if (channel.logo) {
                        <img [src]="channel.logo" [alt]="channel.name" class="w-full h-full object-contain p-1" />
                      } @else {
                        <mat-icon class="text-surface-400">tv</mat-icon>
                      }
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-white truncate">{{ channel.name }}</p>
                      @if (channel.currentProgram) {
                        <p class="text-xs text-surface-400 truncate">{{ channel.currentProgram.title }}</p>
                      }
                    </div>
                    @if (channel.isLive) {
                      <span class="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                    }
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>

      @if (selectedChannel() && epgPrograms().length > 0) {
        <div class="bg-surface-950 border-t border-surface-800/50">
          <div class="content-container py-4">
            <h3 class="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Guía de programación - {{ selectedChannel()?.name }}
            </h3>
            <div class="flex gap-2 overflow-x-auto pb-2">
              @for (program of epgPrograms(); track program.id) {
                <div class="flex-shrink-0 w-48 p-3 rounded-lg cursor-pointer transition-colors"
                     [class.bg-surface-800]="isCurrentProgram(program)"
                     [ngClass]="{'hover:bg-surface-800/50': !isCurrentProgram(program)}">
                  <p class="text-xs text-surface-400 mb-1">
                    {{ program.startTime | date:'HH:mm' }} - {{ program.endTime | date:'HH:mm' }}
                  </p>
                  <p class="text-sm font-medium text-white truncate">{{ program.title }}</p>
                  @if (program.description) {
                    <p class="text-xs text-surface-500 truncate mt-0.5">{{ program.description }}</p>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TvLiveComponent implements OnInit {
  channels = signal<Channel[]>([]);
  selectedChannel = signal<Channel | null>(null);
  epgPrograms = signal<EpgProgram[]>([]);
  searchQuery = '';

  filteredChannels = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.channels();
    return this.channels().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  });

  channelCategories = computed(() => {
    return [...new Set(this.filteredChannels().map(c => c.category).filter(Boolean))] as string[];
  });

  constructor(
    private contentService: ContentService,
    private streamingService: StreamingService
  ) {}

  ngOnInit(): void {
    this.contentService.getChannels().subscribe({
      next: (channels) => this.channels.set(channels)
    });
  }

  selectChannel(channel: Channel): void {
    this.selectedChannel.set(channel);
    this.streamingService.joinChannel(channel.id);

    this.contentService.getChannelEpg(channel.id).subscribe({
      next: (epg) => this.epgPrograms.set(epg)
    });
  }

  getChannelsByCategory(category: string): Channel[] {
    return this.filteredChannels().filter(c => c.category === category);
  }

  isCurrentProgram(program: EpgProgram): boolean {
    const now = new Date();
    const start = new Date(program.startTime);
    const end = new Date(program.endTime);
    return now >= start && now <= end;
  }
}
