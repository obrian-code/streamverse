import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ContentService } from './services/content.service';
import { FavoritesService } from './services/favorites.service';
import { HistoryService } from './services/history.service';
import { StreamingService } from './services/streaming.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [CommonModule],
  providers: [
    ApiService,
    AuthService,
    ContentService,
    FavoritesService,
    HistoryService,
    StreamingService,
    AuthGuard
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule.');
    }
  }
}
