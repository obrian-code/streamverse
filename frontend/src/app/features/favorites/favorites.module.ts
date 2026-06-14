import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FavoritesComponent } from './favorites.component';

const routes: Routes = [{ path: '', component: FavoritesComponent }];

@NgModule({
  declarations: [FavoritesComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class FavoritesModule {}
