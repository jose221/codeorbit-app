import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  map: any;
  nativeElement: any;
  latitude:number  = 21.17429;
  longitude:number = -86.84656;
  constructor(private geolocation: Geolocation) {
  }
  async loadMap(nativeElement: any) {
    try{
      const mapOptions = {
        center: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 14,
      };
      this.map = new google.maps.Map(nativeElement, mapOptions);
      return this.map;
    }catch (e){
      console.error(e);
    }
  }
  async getCurrentPosition(): Promise<any> {
    return (await this.geolocation.getCurrentPosition()).coords;
  }

  async markerMap(position: {lat: number, lng: number}, tag:string, center: boolean): Promise<any> {
    let marker = new google.maps.Marker({
      position,
      map: this.map,
      title: tag
    });
    if(center){
      this.map.panTo(marker.getPosition());
    }
    return marker;
  }
}
