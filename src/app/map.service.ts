import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _mapLayers = new BehaviorSubject<any>(null);
  mapLayers = this._mapLayers.asObservable();
  private _mapFocus = new BehaviorSubject<any>(null);
  mapFocus = this._mapFocus.asObservable();

  constructor() {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
  }

  updateMapFocus(latLongObject){
    this._mapFocus.next(latLongObject);
    console.log('latLongObject', latLongObject);
  }
}

