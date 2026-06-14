import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TvLiveComponent } from './tv-live.component';

const routes: Routes = [{ path: '', component: TvLiveComponent }];

@NgModule({
  declarations: [TvLiveComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class TvLiveModule {}
