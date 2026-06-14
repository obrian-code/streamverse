import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: 'url' | 'resourceUrl' | 'html' | 'style' = 'url'): SafeUrl | SafeResourceUrl | SafeHtml | SafeStyle {
    if (!value) return '';

    switch (type) {
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      default:
        return this.sanitizer.bypassSecurityTrustUrl(value);
    }
  }
}
