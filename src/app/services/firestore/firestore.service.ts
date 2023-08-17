import { Injectable } from '@angular/core';
import {FirestoreRepository} from "../../../domain/repositories/firestore/firestore.repository";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private readonly firestoreRepository: FirestoreRepository) { }
  getCardinals(): Observable<any>{
    return this.firestoreRepository.getCardinals();
  }
}
