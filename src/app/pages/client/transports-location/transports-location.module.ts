import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransportsLocationPageRoutingModule } from './transports-location-routing.module';

import { TransportsLocationPage } from './transports-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransportsLocationPageRoutingModule
  ],
  declarations: [TransportsLocationPage]
})
export class TransportsLocationPageModule {}
