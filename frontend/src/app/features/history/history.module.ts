import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HistoryComponent } from './history.component';

const routes: Routes = [{ path: '', component: HistoryComponent }];

@NgModule({
  declarations: [HistoryComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class HistoryModule {}
