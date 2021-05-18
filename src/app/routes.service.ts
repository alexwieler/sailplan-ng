import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private _routes = new BehaviorSubject<[any]>(['default']);
  routes = this._routes.asObservable();
  routeData: JSON;
  id: any;
  router: string;

  constructor(private http: HttpClient, public auth: AuthService, public _router: Router) {
    this.auth.userProfile$.subscribe(res => this.id = res);
  }

  loadAll(){
    this.http.get<any>(`${environment.baseUrl}/vessels/routes`, {params: {userid: this.id.sub}}).subscribe(
      data => {
        // console.log(data);
        this._routes.next(data);
      },
      error => console.log('Could not load routes.')
    );
  }

  getRouteByVesselId(vesselId){
    this.http.get<any>(`${environment.baseUrl}/vessels/routes`, {params: {userid: this.id.sub}}).subscribe(
      data => {
        let route = data[vesselId];
        console.log('getRouteByVesselId route: ',route);
        this._routes.next([route]);
      },
      error => console.log('Could not load routes.')
    );
  }
}
