import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirestoreService} from "../../../services/firestore/firestore.service";
import {GoogleMapsService} from "../../../services/googleMaps/google-maps.service";
import {ModalController} from "@ionic/angular";
import {PlaceListModalComponent} from "../../../components/client/place-list-modal/place-list-modal.component";
import {Store} from "@ngrx/store";
import {selectRouteClient} from "../../../ngrx/reducers/route-client.reducer";
import {setRouteClient} from "../../../ngrx/actions/route-client.actions";
import {deepCopy} from "../../../../helpers/mapDataHelper";

@Component({
  selector: 'app-transports-location',
  templateUrl: './transports-location.page.html',
  styleUrls: ['./transports-location.page.scss'],
})
export class TransportsLocationPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef = {} as ElementRef;
  routeClient: any = {
    from:{
      latitude: 0,
      longitude: 0,
      name: '',
      formatted_address: '',
      marker: {}
    },
    to:{
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
              private googleMapsService: GoogleMapsService
              ) {
    this.firestoreService.getCardinals().subscribe({
      next: (data) => {
        console.log(data)
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

  initData(){
    this.store.select(selectRouteClient).subscribe({
      next: async (data) => {
        //console.log(data)
        this.routeClient = deepCopy(data.response);
        let validatePoly = true;
        if(this.routeClient.from.longitude && this.routeClient.from.latitude) {
          if(Object.keys(this.routeClient.from.marker).length > 0) await this.googleMapsService.removeMarker(this.routeClient.from.marker);
          this.routeClient.from.marker = await this.googleMapsService.markerMap({lat: this.routeClient.from.latitude, lng: this.routeClient.from.longitude},  this.routeClient.from.name, true);
        }else validatePoly = false;
        if(this.routeClient.to.longitude && this.routeClient.to.latitude) {
          if(Object.keys(this.routeClient.to.marker).length > 0) await this.googleMapsService.removeMarker(this.routeClient.to.marker);
          this.routeClient.to.marker = await this.googleMapsService.markerMap({lat: this.routeClient.to.latitude, lng: this.routeClient.to.longitude},  this.routeClient.to.name, false);
        }else validatePoly = false;

        if(validatePoly){
          //this.googleMapsService.polylineMap([this.routeClient.from.marker.getPosition(), this.routeClient.to.marker.getPosition()]);
          this.googleMapsService.directionsMap(this.routeClient.from.marker.getPosition(), this.routeClient.to.marker.getPosition());
        }
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

  async openPlaceListModal(key:string) {
    const modal = await this.modalController.create({
      component: PlaceListModalComponent,
      componentProps: {
        key: key
      }
    });

    return await modal.present();
  }

  dispatchLoad(params:any): void {
    this.store.dispatch(setRouteClient(params));
  }

}
