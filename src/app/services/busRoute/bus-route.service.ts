import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusRouteService {

  constructor(private http: HttpClient) { }
  getBuses1(){
    return this.http.get("/assets/data/ruta.json").pipe(map((res:any) => {
      res = res.map((item:any) => {
        item.route = item.route.map((route:any) => {
          if(route.latitude < 0){
            let latitude = route.longitude;
            let longitude = route.latitude;
            return {...route, latitude, longitude};
          }
          return route;
        });
        return item;
      });
      return res;
    }));
  }
}
