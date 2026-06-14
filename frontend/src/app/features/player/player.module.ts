import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PlayerComponent } from './player.component';

const routes: Routes = [{ path: '', component: PlayerComponent }];

@NgModule({
  declarations: [PlayerComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class PlayerModule {}
