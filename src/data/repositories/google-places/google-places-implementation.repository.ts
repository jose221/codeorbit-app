import {Injectable} from "@angular/core";
import {GooglePlacesRepository} from "../../../domain/repositories/google-places/google-places.repository";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GooglePlacesImplementationRepository implements GooglePlacesRepository{
constructor(private http: HttpClient) {
}

  private searchPlacesUsingService(query: string): Observable<any> {
    return new Observable((observer) => {
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location: new google.maps.LatLng(20.653805, -87.069347),
        radius: 6000,
        query,
      };

      placesService.textSearch(request, (results: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          observer.next(results);
          observer.complete();
        } else {
          observer.error(status);
        }
      });
    });
  }

  searchPlaces(query: string): Observable<any>{
    return this.searchPlacesUsingService(query);
  }
}

