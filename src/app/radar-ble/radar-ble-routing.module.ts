import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RadarBlePage } from './radar-ble.page';

const routes: Routes = [
  {
    path: '',
    component: RadarBlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadarBlePageRoutingModule {}
