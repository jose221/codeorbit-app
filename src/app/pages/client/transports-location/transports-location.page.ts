import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirestoreService} from "../../../services/firestore/firestore.service";

declare var google: any;

@Component({
  selector: 'app-transports-location',
  templateUrl: './transports-location.page.html',
  styleUrls: ['./transports-location.page.scss'],
})
export class TransportsLocationPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef = {} as ElementRef;
  map: any;

  constructor(private firestoreService: FirestoreService) {
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

  loadMap() {
    const mapOptions = {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
