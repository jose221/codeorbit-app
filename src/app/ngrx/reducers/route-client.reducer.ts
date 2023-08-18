import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import {initialRouteClientState} from "../actions/route-client.actions";
import * as actions from '../actions/route-client.actions';


export const routeClientReducer = createReducer(
  initialRouteClientState,
  on(actions.setRouteClient, (state, response ) => ({ ...state, response }))
);

export const selectRouteClientState = createFeatureSelector<any>('routeClient');


export const selectRouteClient = createSelector(
  selectRouteClientState,
  (state) => {
    return {...state}
  }
);
