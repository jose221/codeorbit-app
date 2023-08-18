import {Observable} from "rxjs";

export abstract class GooglePlacesRepository{
  abstract searchPlaces(query: string): Observable<any>;
}
