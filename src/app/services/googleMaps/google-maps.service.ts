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
  async removeMarker(marker: any): Promise<any> {
    return  marker.setMap(null);
  }

  async polylineMap(positions: {lat: number, lng: number}[], color:string = '#0000FF'): Promise<any> {
    let polyline = new google.maps.Polyline({
      path: positions,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    polyline.setMap(this.map);
    return polyline;
  }
  directionsMap(origin:{lat: number, lng: number},destination:{lat: number, lng: number}) {
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin, // Coordenadas del origen
      destination, // Coordenadas del destino
      travelMode: google.maps.TravelMode.DRIVING // Modo de viaje (puede ser DRIVING, WALKING, etc.)
    };

    directionsService.route(request, (result:any, status:any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(this.map);
        directionsRenderer.setDirections(result);
        return directionsRenderer;
      }
      return null;
    });
  }

}
