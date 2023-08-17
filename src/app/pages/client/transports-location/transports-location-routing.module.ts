import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportsLocationPage } from './transports-location.page';

const routes: Routes = [
  {
    path: '',
    component: TransportsLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportsLocationPageRoutingModule {}
