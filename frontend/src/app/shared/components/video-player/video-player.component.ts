import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

declare const Hls: any;

@Component({
  selector: 'sv-video-player',
  template: `
    <div class="relative w-full bg-black" [class]="containerClass">
      <div class="relative" [style.aspect-ratio]="aspectRatio">
        <video #videoPlayer
               class="video-js vjs-streamverse-skin vjs-big-play-centered vjs-16-9 w-full h-full"
               [id]="playerId"
               [attr.playsinline]="true"
               webkit-playsinline>
          @for (src of sources; track src.src) {
            <source [src]="src.src" [type]="src.type">
          }
          @for (track of tracks; track track.src) {
            <track [src]="track.src" [kind]="track.kind" [label]="track.label"
                   [srclang]="track.srclang || 'en'"
                   [default]="track.default || false">
          }
          <p class="vjs-no-js">
            To view this video please enable JavaScript
          </p>
        </video>

        @if (!isReady) {
          <div class="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div class="flex flex-col items-center gap-3">
              <mat-spinner diameter="48" strokeWidth="4"></mat-spinner>
              <span class="text-surface-400 text-sm">Cargando...</span>
            </div>
          </div>
        }
      </div>

      @if (showInfo && currentTitle) {
        <div class="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div class="flex items-center gap-3">
            <button class="pointer-events-auto btn-ghost p-2 rounded-full bg-black/40 backdrop-blur-sm"
                    (click)="onBack()"
                    matTooltip="Volver">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="flex flex-col">
              <span class="text-white text-lg font-semibold drop-shadow-lg">{{ currentTitle }}</span>
              @if (currentSubtitle) {
                <span class="text-surface-300 text-sm drop-shadow">{{ currentSubtitle }}</span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    ::ng-deep .vjs-streamverse-skin {
      &.vjs-fullscreen {
        .vjs-control-bar {
          padding-bottom: 16px;
        }
      }
    }
  `]
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;

  @Input() playerId = `player-${Math.random().toString(36).substring(2, 10)}`;
  @Input() sources: { src: string; type: string }[] = [];
  @Input() tracks: { src: string; kind: string; label: string; srclang?: string; default?: boolean }[] = [];
  @Input() poster = '';
  @Input() autoplay = true;
  @Input() controls = true;
  @Input() fluid = true;
  @Input() aspectRatio = '16/9';
  @Input() containerClass = '';
  @Input() showInfo = true;
  @Input() currentTitle = '';
  @Input() currentSubtitle = '';
  @Input() startPosition = 0; // resume in seconds

  @Input() onBack: () => void = () => {};
  @Input() onTimeUpdate: (currentTime: number, duration: number) => void = () => {};
  @Input() onEnded: () => void = () => {};

  isReady = signal(false);
  private player: any = null;
  private hlsInstances: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initPlayer();
  }

  private initPlayer(): void {
    const videoEl = this.videoElement.nativeElement;

    if (videoEl) {
      const hasHlsSource = this.sources.some(s => s.type === 'application/x-mpegURL' || s.type === 'application/vnd.apple.mpegurl');

      if (hasHlsSource && Hls && Hls.isSupported()) {
        const originalAppendChild = videoEl.appendChild.bind(videoEl);
        videoEl.appendChild = ((child: Node) => {
          originalAppendChild(child);
          if ((child as HTMLElement)?.tagName === 'SOURCE') {
            this.initHls(videoEl, (child as HTMLSourceElement).src);
          }
          return child;
        }) as typeof videoEl.appendChild;
      }
    }

    const options: any = {
      controls: this.controls,
      autoplay: this.autoplay,
      fluid: this.fluid,
      poster: this.poster,
      html5: {
        hls: {
          overrideNative: !(videoEl && videoEl.canPlayType('application/vnd.apple.mpegurl')),
          enableLowInitialPlaylist: true,
          smoothQualityChange: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        pictureInPictureToggle: true,
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'liveDisplay',
          'seekToLive',
          'remainingTimeDisplay',
          'customControlSpacer',
          'playbackRateMenuButton',
          'chaptersButton',
          'descriptionsButton',
          'subsCapsButton',
          'audioTrackButton',
          'fullscreenToggle'
        ]
      }
    };

    this.player = videojs(this.playerId, options, () => {
      this.isReady.set(true);

      if (this.startPosition > 0) {
        this.player.currentTime(this.startPosition);
      }

      this.player.on('timeupdate', () => {
        const ct = this.player.currentTime();
        const dur = this.player.duration();
        if (dur > 0) {
          this.onTimeUpdate(ct, dur);
        }
      });

      this.player.on('ended', () => {
        this.onEnded();
      });

      this.player.on('error', (err: any) => {
        console.error('[VideoPlayer] Error:', err);
      });
    });
  }

  private initHls(videoEl: HTMLVideoElement, src: string): void {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backbufferLength: 30
    });

    hls.loadSource(src);
    hls.attachMedia(videoEl);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (this.autoplay) {
        videoEl.play().catch(() => {});
      }
    });

    this.hlsInstances.push(hls);
  }

  setSrc(src: string, type: string): void {
    if (this.player) {
      this.player.src({ src, type });
      this.player.load();
    } else {
      this.sources = [{ src, type }];
    }
  }

  seekTo(time: number): void {
    if (this.player) {
      this.player.currentTime(time);
    }
  }

  togglePlay(): void {
    if (this.player) {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }

  enterFullscreen(): void {
    if (this.player) {
      this.player.requestFullscreen();
    }
  }

  exitFullscreen(): void {
    if (this.player) {
      this.player.exitFullscreen();
    }
  }

  getCurrentTime(): number {
    return this.player?.currentTime() ?? 0;
  }

  getDuration(): number {
    return this.player?.duration() ?? 0;
  }

  ngOnDestroy(): void {
    this.hlsInstances.forEach(hls => {
      try { hls.destroy(); } catch {}
    });
    this.hlsInstances = [];

    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }
}
