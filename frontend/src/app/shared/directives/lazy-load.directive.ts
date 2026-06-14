import { Directive, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[lazyLoad]' })
export class LazyLoadDirective implements AfterViewInit, OnDestroy {
  @Input() lazyLoadSrc = '';
  @Input() lazyLoadBackground = false;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.load();
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.load();
          this.observer?.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    this.observer.observe(this.el.nativeElement);
  }

  private load(): void {
    const el = this.el.nativeElement;

    if (this.lazyLoadBackground) {
      (el as HTMLElement).style.backgroundImage = `url(${this.lazyLoadSrc})`;
    } else if (el.tagName === 'IMG') {
      (el as HTMLImageElement).src = this.lazyLoadSrc;
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
