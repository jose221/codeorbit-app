import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../environments/environment";

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {FirestoreRepository} from "../domain/repositories/firestore/firestore.repository";
import { FirestoreImplementationRepository } from "./repositories/firestore/firestore-implementation.repository";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {GooglePlacesRepository} from "../domain/repositories/google-places/google-places.repository";
import {GooglePlacesImplementationRepository} from "./repositories/google-places/google-places-implementation.repository";
@NgModule({
  providers: [
    Geolocation,
    { provide: FirestoreRepository, useClass: FirestoreImplementationRepository },
    { provide: GooglePlacesRepository, useClass: GooglePlacesImplementationRepository },
    ],
  declarations: [],
  imports: [
    CommonModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig ) ),
    provideFirestore(() => getFirestore()),
  ]
})
export class DataModule { }
