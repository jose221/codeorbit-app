import {createAction, props} from "@ngrx/store";

export const initialRouteClientState: any = {
  response:{
    from:{
      latitude: 0,
      longitude: 0,
      name: 'Mi ubicación',
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
  }
};

export const setRouteClient = createAction(
  '[RouteClient] Set RouteClient',
  props<any>()
);
