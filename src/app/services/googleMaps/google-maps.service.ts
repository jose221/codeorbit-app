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

  async markerMap(position: {lat: number, lng: number}, tag:string, center: boolean, icon:any = null): Promise<any> {
    const option:any  ={
      position,
      map: this.map,
      title: tag
    };

    if(icon) option.icon = icon;

    let marker = new google.maps.Marker(option);
    if(center){
      this.map.panTo(marker.getPosition());
    }
    return marker;
  }
  async removeMarker(marker: any): Promise<any> {
    return  marker.setMap(null);
  }

  async pointsMap(params:Array<any>): Promise<any> {
    let markers:any = [];
    let polyConnect:any = [];
    params.forEach((position) => {
      const coordinate = {
        lat: position.latitude,
        lng: position.longitude
      };
      polyConnect.push(coordinate);
      const marker = this.markerMap(coordinate, 'punto ruta', false, {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'blue', // Color de relleno del círculo
        fillOpacity: 1,    // Opacidad del relleno
        strokeColor: 'white', // Color del borde
        strokeWeight: 1,   // Grosor del borde
        scale: 5,          // Escala del círculo
      });



      markers.push({...marker, coordinate});
    });
    //const polyline = this.polylineMap(polyConnect, '#2a53ee');
    return {markers,
      //polyline
    };
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
  directionsMap(origin:{lat: number, lng: number},destination:{lat: number, lng: number}): Promise<any> {
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin, // Coordenadas del origen
      destination, // Coordenadas del destino
      travelMode: google.maps.TravelMode.DRIVING // Modo de viaje (puede ser DRIVING, WALKING, etc.)
    };
    return this.getDirectionsPromise(directionsService, request);
  }
    async removePolyline(polyline: any): Promise<any> {
    return  polyline.setMap(null);
    }

  private getDirectionsPromise(directionsService:any, request:any): Promise<any> {
    return new Promise((resolve, reject) => {
      directionsService.route(request, (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(this.map);
          directionsRenderer.setDirections(result);
          resolve(directionsRenderer);
        } else {
          reject(new Error('No se pudo encontrar una ruta.'));
        }
      });
    });
  }

  async findClosestRoute(origin: any, destinations: Array<any>): Promise<any> {
    const directionsService = new google.maps.DirectionsService();

    let closestRoute: any = null;
    let closestDistance = Infinity;
    let coor: any = null;

    for (const destination of destinations) {
      try {
        const route = await new Promise<any>((resolve: any, reject: any) => {
          directionsService.route({
            origin: {
              lat: origin.latitude,
              lng: origin.longitude
            },
            destination: {
              lat: destination.latitude,
              lng: destination.longitude
            },
            travelMode: google.maps.TravelMode.DRIVING
          }, (result: any, status: any) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve(result);
            } else {
              reject(status);
            }
          });
        });

        const distance = route.routes[0].legs[0].distance.value;
        if (distance < closestDistance) {
          closestRoute = route;
          closestDistance = distance;
          coor = destination;
        }
      } catch (error) {
        console.error("Error calculating route:", error);
      }
    }

    if (!closestRoute) {
      closestRoute = {}; // Asigna un objeto vacío como valor predeterminado
      closestDistance = -1; // Asigna un valor negativo como valor predeterminado
      coor = null; // Asigna null como valor predeterminado
    }

    return { closestRoute, coor, closestDistance };
  }

}
