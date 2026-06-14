import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SeriesComponent } from './series.component';
import { SeriesDetailComponent } from './series-detail.component';

const routes: Routes = [
  { path: '', component: SeriesComponent },
  { path: ':id', component: SeriesDetailComponent }
];

@NgModule({
  declarations: [SeriesComponent, SeriesDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class SeriesModule {}
