import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService, MediaItem, Movie, Series, Category } from '../../core/services/content.service';

@Component({
  selector: 'sv-home',
  template: `
    @if (featuredContent(); as featured) {
      <sv-hero-banner
        [content]="featured"
        [genres]="featuredGenres()"
        [onPlay]="playContent.bind(this, featured)"
        [onInfo]="showInfo.bind(this, featured)"
        [onToggleFavorite]="toggleFavorite.bind(this, featured)" />
    } @else if (!loaded()) {
      <div class="w-full h-[85vh] min-h-[600px] skeleton"></div>
    }

    <div class="relative z-10 -mt-32 pb-16 space-y-8">
      @if (!loaded() && !featuredContent()) {
        @for (_ of [].constructor(4); track _) {
          <div class="px-4 md:px-8 mb-4">
            <div class="h-7 skeleton rounded w-48 mb-4"></div>
            <div class="flex gap-3">
              @for (_ of [].constructor(6); track _) {
                <div class="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
                  <div class="aspect-[2/3] skeleton rounded-lg"></div>
                  <div class="mt-2 space-y-1.5">
                    <div class="h-4 skeleton rounded w-3/4"></div>
                    <div class="h-3 skeleton rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      }

      @if (continueWatching().length > 0) {
        <sv-content-row
          title="Continuar viendo"
          [items]="continueWatching()"
          [onItemClick]="playContent.bind(this)" />
      }

      <sv-content-row
        title="Tendencias"
        [items]="trending()"
        viewAllLink="/search?sort=trending"
        [onItemClick]="playContent.bind(this)" />

      @for (category of categories(); track category.id) {
        <sv-content-row
          [title]="category.name"
          [items]="categoryItems(category.id)"
          [viewAllLink]="'/' + category.type + 's?genre=' + category.slug"
          [onItemClick]="playContent.bind(this)" />
      }

      <sv-content-row
        title="Recomendados para ti"
        [items]="recommended()"
        [onItemClick]="playContent.bind(this)" />
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class HomeComponent implements OnInit {
  loaded = signal(false);
  featuredContent = signal<(Movie | Series) | null>(null);
  featuredGenres = signal<string[]>([]);
  trending = signal<MediaItem[]>([]);
  continueWatching = signal<MediaItem[]>([]);
  recommended = signal<MediaItem[]>([]);
  categories = signal<Category[]>([]);

  private allMovies: Movie[] = [];
  private allSeries: Series[] = [];

  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  private loadContent(): void {
    let completed = 0;
    const checkDone = () => {
      completed++;
      if (completed >= 5) this.loaded.set(true);
    };

    this.contentService.getFeaturedMovies().subscribe({
      next: (movies) => {
        if (movies.length > 0) {
          this.featuredContent.set(movies[0]);
          this.featuredGenres.set(movies[0].genres?.map(g => g.name) || []);
        }
        checkDone();
      },
      error: () => checkDone()
    });

    this.contentService.getTrending().subscribe({
      next: (items) => { this.trending.set(items); checkDone(); },
      error: () => checkDone()
    });

    this.contentService.getContinueWatching().subscribe({
      next: (items) => { this.continueWatching.set(items); checkDone(); },
      error: () => checkDone()
    });

    this.contentService.getRecommended().subscribe({
      next: (items) => { this.recommended.set(items); checkDone(); },
      error: () => checkDone()
    });

    this.contentService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories.slice(0, 6));
        this.loadContentByGenre(categories.slice(0, 6));
        checkDone();
      },
      error: () => checkDone()
    });
  }

  private loadContentByGenre(genres: Category[]): void {
    this.contentService.getMovies({ page: 1 }).subscribe({
      next: (res) => this.allMovies = res.data
    });
    this.contentService.getSeries({ page: 1 }).subscribe({
      next: (res) => this.allSeries = res.data
    });
  }

  categoryItems(genreId: string): MediaItem[] {
    return [
      ...this.allMovies.filter(m => m.genreIds?.includes(genreId)),
      ...this.allSeries.filter(s => s.genreIds?.includes(genreId))
    ].slice(0, 10);
  }

  playContent(content: MediaItem): void {
    this.router.navigate(['/player', content.id], {
      queryParams: { type: content.type }
    });
  }

  showInfo(content: MediaItem): void {
    if (content.type === 'series') {
      this.router.navigate(['/series', content.id]);
    } else {
      this.router.navigate(['/player', content.id], {
        queryParams: { type: content.type, info: 'true' }
      });
    }
  }

  toggleFavorite(content: MediaItem): void {}
}
