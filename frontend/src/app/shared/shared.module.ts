import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { ContentCardComponent } from './components/content-card/content-card.component';
import { ContentRowComponent } from './components/content-row/content-row.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ToastComponent } from './components/toast/toast.component';
import { ModalComponent } from './components/modal/modal.component';

import { TruncatePipe } from './pipes/truncate.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { LazyLoadDirective } from './directives/lazy-load.directive';

const components = [
  HeroBannerComponent,
  ContentCardComponent,
  ContentRowComponent,
  VideoPlayerComponent,
  SearchBarComponent,
  CategoryFilterComponent,
  EmptyStateComponent,
  ToastComponent,
  ModalComponent
];

const pipes = [TruncatePipe, DurationPipe, SafeUrlPipe];

const directives = [ClickOutsideDirective, LazyLoadDirective];

@NgModule({
  declarations: [...components, ...pipes, ...directives],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ...components,
    ...pipes,
    ...directives
  ]
})
export class SharedModule {}
