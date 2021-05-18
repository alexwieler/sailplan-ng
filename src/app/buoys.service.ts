import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuoysService {

  private _buoys = new BehaviorSubject<[string]>(['default']);
  buoys = this._buoys.asObservable();
  buoyData: JSON;
  id: any;
  router: string;

  constructor(private http: HttpClient, public auth: AuthService, public _router: Router) {
    this.auth.userProfile$.subscribe(res => this.id = res);
  }


  loadAll(){
    if (true || this._router.url == '/myinfrastructures' || this._router.url.includes("dashboard"))
    {
      this.http.get<any>(`${environment.baseUrl}/buoys`, {params: {userid: this.id.sub}}).subscribe(
        data => {

          if (true || !data[0].hasOwnProperty('abort'))
          {
            this._buoys.next(data);
          }
        },
        error => console.log('error refreshing buoy data')
      );
    }
    //
    // this.http.post<any>('http://localhost:8000/buoys/getbuoys', {userid: this.id.sub, firstrequest: true}).subscribe(
    //   data => {
    //     this._buoys.next(data);
    //   },
    //   error => console.log('Could not load buoys.')
    // );
    //
    // var refreshdata = setInterval( () => {
    //
    //   if (this._router.url == '/myinfrastructures' || this._router.url.includes("dashboard"))
    //   {
    //     this.http.post<any>('http://localhost:8000/buoys/getbuoys', {userid: this.id.sub}).subscribe(
    //     data => {
    //
    //       if (!data[0].hasOwnProperty('abort'))
    //       {
    //         this._buoys.next(data);
    //       }
    //     },
    //     error => console.log('error refreshing buoy data')
    //   );
    //   }
    //   else
    //   {
    //     clearInterval(refreshdata);
    //   }
    //     }, 1000);

  }

}
