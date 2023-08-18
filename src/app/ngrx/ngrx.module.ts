import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {routeClientReducer} from "./reducers/route-client.reducer";
import {StoreModule} from "@ngrx/store";
import { EffectsModule } from '@ngrx/effects';
import {RouteClientEffects} from "./effects/route-client.effects";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ routeClient: routeClientReducer }), // Agrega el reducer al store
    EffectsModule.forRoot([RouteClientEffects]),
  ]
})
export class NgrxModule { }
