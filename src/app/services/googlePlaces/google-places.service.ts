import { Injectable } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Observable} from "rxjs";
import {GooglePlacesRepository} from "../../../domain/repositories/google-places/google-places.repository";

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  constructor(  private modalController: ModalController,
                private googlePlacesRepository: GooglePlacesRepository) {
  }

  searchPlaces(query: string): Observable<any>{
    return this.googlePlacesRepository.searchPlaces(query);
  }
}
