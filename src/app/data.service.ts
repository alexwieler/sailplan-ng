import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _data = new BehaviorSubject<string>(null);
  vesselId = this._data.asObservable();

  private _detailsSection = new BehaviorSubject<string>(null);
  detailsSection = this._detailsSection.asObservable();

  private _focusVessel = new BehaviorSubject<number>(null);
  focusVessel = this._focusVessel.asObservable();





  // id: any;
  // router: string;
  //
  // constructor(private http: HttpClient, public auth: AuthService, public _router: Router) {
  //
  //   // this.auth.userProfile$.subscribe(res => this.id = res);
  //
  // }

  constructor(){

  }

  updateDetailsSection(detailsSection){
    this._detailsSection.next(detailsSection);
  }

  // TODO:  Bug - this is getting called multiple times if I click vessel rows back and forth
  updateData(vesselId) {
    this._data.next(vesselId);
  }

  updateFocusVessel(vesselId){
    this._focusVessel.next(vesselId);
  }

}
