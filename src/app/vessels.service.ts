import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VesselsService {

  private _vessels = new BehaviorSubject<[string]>(['default']);
  vessels = this._vessels.asObservable();

  private _gpsVessels = new BehaviorSubject<[any]>([{}]);
  gpsVessels = this._gpsVessels.asObservable();

  vesselData: JSON;
  id: any;

  router: string;

  constructor(private http: HttpClient, public auth: AuthService, public _router: Router) {
    this.auth.userProfile$.subscribe(res => this.id = res);

  }
  getGpsVessels() {
    return this._gpsVessels.value;
  }

  loadAll(){

    if (this._router.url == '/myfleet' || this._router.url.includes("dashboard") ) {
      this.http.get<any>(`${environment.baseUrl}/vessels`, {params: {userid: this.id.sub}}).subscribe(
        data => {
          this._vessels.next(data);
        },
        error => console.log('Could not load vessels.')
      );
    }

    // this.http.post<any>('http://localhost:8000/vessels/getvessels', {userid: this.id.sub}).subscribe(
    //   data => {
    //     this._vessels.next(data);
    //   },
    //   error => console.log('Could not load vessels.')
    // );
    //
    // var refreshdata = setInterval( () => {
    //   // TODO:  I think we should consider finding a way to refactor this "router if-statement" code wherever it exists (I'm not sure what the alternative would be)
    //   if (this._router.url == '/myfleet' || this._router.url.includes("dashboard") )
    //   {
    //     this.http.post<any>('http://localhost:8000/vessels/getvessels', {userid: this.id.sub}).subscribe(
    //     data => {
    //       this._vessels.next(data);
    //     },
    //     error => console.log('Could not load vessels.')
    //   );
    //   }
    //   else
    //   {
    //     clearInterval(refreshdata);
    //   }
    //     }, 1000);

  }

  deleteVessel(vesselId: string): void{
    // TODO:  Figure out if we should be doing a post here (for user authentication) or if we can use delete?  (low priority)
    this.http.post<any>(`${environment.baseUrl}/vessels/delete/` + vesselId, {userid: this.id.sub}).subscribe(
      data => {
        this._vessels.next(data);
      },
      error => console.log('Could not load vessels.')
    );
  }

  updateGpsVesselList(gpsVesselList){
    this._gpsVessels.next(gpsVesselList);
  }



}
