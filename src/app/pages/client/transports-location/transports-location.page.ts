import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirestoreService} from "../../../services/firestore/firestore.service";
import {GoogleMapsService} from "../../../services/googleMaps/google-maps.service";

@Component({
  selector: 'app-transports-location',
  templateUrl: './transports-location.page.html',
  styleUrls: ['./transports-location.page.scss'],
})
export class TransportsLocationPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef = {} as ElementRef;

  constructor(private firestoreService: FirestoreService,
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
  }

  async loadMap() {
    let map = await this.googleMapsService.loadMap(this.mapElement.nativeElement);
    let currentPosition = await this.googleMapsService.getCurrentPosition();
    let marker = await this.googleMapsService.markerMap({lat: currentPosition.latitude, lng: currentPosition.longitude}, 'Mi ubicación', true);
  }

}
