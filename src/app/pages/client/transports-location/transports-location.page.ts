import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirestoreService} from "../../../services/firestore/firestore.service";
import {GoogleMapsService} from "../../../services/googleMaps/google-maps.service";
import {ModalController} from "@ionic/angular";
import {PlaceListModalComponent} from "../../../components/client/place-list-modal/place-list-modal.component";
import {Store} from "@ngrx/store";
import {selectRouteClient} from "../../../ngrx/reducers/route-client.reducer";
import {setRouteClient} from "../../../ngrx/actions/route-client.actions";
import {deepCopy} from "../../../../helpers/mapDataHelper";
import {BusRouteService} from "../../../services/busRoute/bus-route.service";



@Component({
  selector: 'app-transports-location',
  templateUrl: './transports-location.page.html',
  styleUrls: ['./transports-location.page.scss'],
})
export class TransportsLocationPage implements OnInit {
  @ViewChild('map', {static: true}) mapElement: ElementRef = {} as ElementRef;

  locationsRoutes: any[] = [
    {
      id: 1,
      name: 'ruta 2',
      description: 'ruta 2 La Joya',
      route: [
        {
          latitude: 21.171427,
          longitude: -86.911727
        },
        {
          latitude: 21.171835,
          longitude: -86.910604
        },
        {
          latitude: 21.173120,
          longitude: -86.908009
        },
        {
          latitude: 21.173120,
          longitude: -86.905872
        }
      ]
    },
    {
      id: 2,
      name: 'ruta 1',
      description: 'ruta 1 Villas del Mar',
      route: [
        {
          latitude: 21.173901,
          longitude: -86.912275
        },
        {
          latitude: 21.172843,
          longitude: -86.911653,
        },
        {
          latitude: 21.172421,
          longitude: -86.911370,
        },
        {
          latitude: 21.173174,
          longitude: -86.910767,
        },
        {
          latitude: 21.174223,
          longitude: -86.910088,
        },
        {
          latitude: 21.175260,
          longitude: -86.909365,
        }
      ]
    },
    {
      id: 3,
      name: 'ruta 2',
      description: 'Corales',
      route: [
        {
          latitude: 21.194282633439183,
          longitude: -86.83092017901953
        },
        {
          latitude: 21.194023210785023,
          longitude: -86.82717278127193
        },
        {
          latitude: 21.190642,
          longitude: -86.827429
        }
      ]
    },
  ];
  currentMapTrack = null;
  routeClient: any = {
    from: {
      latitude: 0,
      longitude: 0,
      name: '',
      formatted_address: '',
      marker: {}
    },
    to: {
      latitude: 0,
      longitude: 0,
      name: '',
      formatted_address: '',
      marker: {}
    }
  };

  constructor(private firestoreService: FirestoreService,
              private modalController: ModalController,
              private store: Store<{ response: any }>,
              private googleMapsService: GoogleMapsService,
              private busRouteService: BusRouteService
  ) {
    this.firestoreService.getCardinals().subscribe({
      next: (data) => {
        //console.log(data)
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  ngOnInit() {
    this.loadMap();
    this.initData();
  }

  initData() {
    this.store.select(selectRouteClient).subscribe({
      next: async (data) => {
        //console.log(data)
        this.routeClient = deepCopy(data.response);
        let validatePoly = true;
        if (this.routeClient.from.longitude && this.routeClient.from.latitude) {
          if (Object.keys(this.routeClient.from.marker).length > 0) await this.googleMapsService.removeMarker(this.routeClient.from.marker);
          this.routeClient.from.marker = await this.googleMapsService.markerMap({
            lat: this.routeClient.from.latitude,
            lng: this.routeClient.from.longitude
          }, this.routeClient.from.name, true);
        } else validatePoly = false;
        if (this.routeClient.to.longitude && this.routeClient.to.latitude) {
          if (Object.keys(this.routeClient.to.marker).length > 0) await this.googleMapsService.removeMarker(this.routeClient.to.marker);
          this.routeClient.to.marker = await this.googleMapsService.markerMap({
            lat: this.routeClient.to.latitude,
            lng: this.routeClient.to.longitude
          }, this.routeClient.to.name, false);
        } else validatePoly = false;

        if (validatePoly) {
          this.googleMapsService.polylineMap([this.routeClient.from.marker.getPosition(), this.routeClient.to.marker.getPosition()]);
          if (this.currentMapTrack) await this.googleMapsService.removePolyline(this.currentMapTrack);

        }
        await this.loadRoute();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async loadMap() {
    let map = await this.googleMapsService.loadMap(this.mapElement.nativeElement);
    let currentPosition = await this.googleMapsService.getCurrentPosition();
    this.routeClient.from.latitude = currentPosition.latitude;
    this.routeClient.from.longitude = currentPosition.longitude;
    this.dispatchLoad(this.routeClient);
  }

  async openPlaceListModal(key: string) {
    const modal = await this.modalController.create({
      component: PlaceListModalComponent,
      componentProps: {
        key: key
      }
    });

    return await modal.present();
  }

  async loadRoute() {

    this.busRouteService.getBuses1().subscribe({
      next: async (data) => {
        this.locationsRoutes = data as Array<any>;
        if (this.routeClient.to.latitude && this.routeClient.to.longitude) {
          this.locationsRoutes = await this.searchRoute(this.locationsRoutes, 'to');
        }

        if (this.routeClient.from.latitude && this.routeClient.from.longitude) {
          let search = this.routeClient.to.latitude && this.routeClient.to.longitude ? deepCopy(this.locationsRoutes).slice(0, 1) : deepCopy(this.locationsRoutes);

          this.locationsRoutes = await this.searchRoute(search, 'from');
          if(this.routeClient.to.latitude && this.routeClient.to.longitude){
            console.log(this.locationsRoutes)
          }
        }
      },
      error: (err)=>{

      }
    });
  }

  async searchRoute(listRoutes: Array<any>, key: string) {
    listRoutes = deepCopy(listRoutes);
    // Usamos Promise.all para esperar a que todas las promesas dentro del map se resuelvan
    const updatedLocationsRoutes = await Promise.all(listRoutes.map(async (item:any, index: number) => {
      item.makers = this.googleMapsService.pointsMap(item.route.slice(0,50));
      item.closeRoute = await this.googleMapsService.findClosestRoute(this.routeClient[key], item.route.slice(0,50));
      return item; // No necesitas usar 'await' aquí, ya que 'item' es síncrono
    }));

    updatedLocationsRoutes.sort((a, b) => a.closeRoute.closestDistance - b.closeRoute.closestDistance);
    return updatedLocationsRoutes;
  }

  dispatchLoad(params: any): void {
    this.store.dispatch(setRouteClient(params));
  }
}


