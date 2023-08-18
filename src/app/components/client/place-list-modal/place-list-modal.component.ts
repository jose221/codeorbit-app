import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {GooglePlacesService} from "../../../services/googlePlaces/google-places.service";
import {setRouteClient} from "../../../ngrx/actions/route-client.actions";
import {Store} from "@ngrx/store";
import {selectRouteClient} from "../../../ngrx/reducers/route-client.reducer";
import {deepCopy} from "../../../../helpers/mapDataHelper";

@Component({
  selector: 'app-place-list-modal',
  templateUrl: './place-list-modal.component.html',
  styleUrls: ['./place-list-modal.component.scss'],
})
export class PlaceListModalComponent  implements OnInit {

  places: any[] = [];
  searchQuery: string = '';
  key: string = '';
  routeClient: any ={};
  constructor(private modalController: ModalController,
              private googlePlacesService: GooglePlacesService,
              private store: Store<any>,
              private navParams: NavParams
              ) {
    this.key = this.navParams.get('key');
  }

  ngOnInit() {
    this.init()
  }

  search() {
    this.places = [];
    if(this.searchQuery != '') {
      this.googlePlacesService.searchPlaces(this.searchQuery).subscribe({
        next: (data: any) => {
          //console.log(data)
          this.places = data;
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  selectPlace(place: any) {
    this.dispatchLoad({
      ...this.routeClient,
      [this.key]: {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        name: place.name,
        marker: {},
        formatted_address: place.formatted_address
      }
    })
    this.closeModal();
  }
  init(){
    this.store.select(selectRouteClient).subscribe({
      next: (data) => {
        //console.log(data)
        this.routeClient = deepCopy(data.response);
        //console.log(this.routeClient)
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  dispatchLoad(params:any): void {
    this.store.dispatch(setRouteClient(params));
  }
}
