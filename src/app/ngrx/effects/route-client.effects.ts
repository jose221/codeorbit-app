import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as actions from '../actions/route-client.actions';
import {tap} from "rxjs";
@Injectable()
export class RouteClientEffects {
  setRouteClient$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.setRouteClient),
        tap(action => {
          //console.log('Latitud:', action.latitude);
          //console.log('Longitud:', action.longitude);
          // Aquí puedes realizar cualquier otra lógica que necesites
        })
      ),
    { dispatch: false } // No necesitas realizar otro dispatch aquí
  );

  constructor(private actions$: Actions) {}
}
