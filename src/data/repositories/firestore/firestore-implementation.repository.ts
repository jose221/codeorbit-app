import {Observable} from "rxjs";
import {FirestoreRepository} from "../../../domain/repositories/firestore/firestore.repository";
import {CardinalModel} from "../../../domain/models/cardinal/cardinal.model";
import {inject, Injectable} from "@angular/core";
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
//https://github.com/angular/angularfire#readme
export class FirestoreImplementationRepository implements FirestoreRepository{
  constructor(private firestore: Firestore = inject(Firestore)) {}

  getCardinals(): Observable<any> {
    const itemCollection = collection(this.firestore, 'transports');
    let data = collectionData(itemCollection);
    return data;
  }
}
