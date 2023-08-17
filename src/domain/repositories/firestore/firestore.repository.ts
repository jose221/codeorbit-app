import {Observable} from "rxjs";
import {CardinalModel} from "../../models/cardinal/cardinal.model";

export abstract class FirestoreRepository{
  abstract getCardinals():Observable<any>;
}
