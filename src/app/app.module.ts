import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import {PlaceListModalComponent} from "../app/components/client/place-list-modal/place-list-modal.component";
import { AppRoutingModule } from './app-routing.module';
import {DataModule} from "../data/data.module";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgrxModule} from "./ngrx/ngrx.module"; // Asegúrate de importar FormsModule


@NgModule({
  declarations: [AppComponent, PlaceListModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, DataModule, HttpClientModule, FormsModule, NgrxModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
