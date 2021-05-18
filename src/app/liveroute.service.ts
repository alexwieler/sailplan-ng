import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiverouteService {

  private _livevessel = new BehaviorSubject<[string]>(['default']);
  livevessel = this._livevessel.asObservable();
  routeData: JSON;
  id: any;
  vesselids: [];

  constructor(private http: HttpClient, public auth: AuthService) {
    this.auth.userProfile$.subscribe(res => this.id = res);
  }

  loadAll(){
    this.http.post<any>(`${environment.baseUrl}/vessels/livevessels`, { userid: this.id.sub, vesselids: this.vesselids }).subscribe(
      data => {
        this._livevessel.next(data);
        console.log(data);
      },
      error => console.log('Could not load live vesseks.')
    );
  }

  addvessel(route){

  }
}
