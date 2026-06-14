import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MoviesComponent } from './movies.component';

const routes: Routes = [{ path: '', component: MoviesComponent }];

@NgModule({
  declarations: [MoviesComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class MoviesModule {}
