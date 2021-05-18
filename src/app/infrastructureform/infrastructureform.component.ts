/**
 * Form used to add infrastructures to the user's account
 */
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl} from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-infrastructureform',
  templateUrl: './infrastructureform.component.html',
  styleUrls: ['./infrastructureform.component.css']
})
/**
 * We have an angular form that we use to get data from the user on the infrastructure
 */
export class InfrastructureformComponent implements OnInit {
 

  userdata: any;
  responseJson: JSON;
  infrastructureform = new FormGroup({
    nickname: new FormControl(''),
    country: new FormControl(''),
    baselat: new FormControl(''),
    baselong: new FormControl(''),
    radius: new FormControl(''),
    period: new FormControl(''),
    textmessage: new FormControl(''),
    email: new FormControl('')
  });

  error_msg: string;

  constructor(public auth: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.auth.userProfile$.subscribe(
      val => this.userdata = val
    );

    if (!(this.infrastructureform.value.textmessage == 0 && this.infrastructureform.value.email == 0)
    && this.infrastructureform.value.nickname && this.infrastructureform.value.country 
    && this.infrastructureform.value.radius && this.infrastructureform.value.baselat && this.infrastructureform.value.baselong && this.infrastructureform.value.period)
    {
      this.http.post<JSON>(`${environment.baseUrl}/buoys`, {newbuoy: this.infrastructureform.value, auth: this.userdata}).subscribe(
        res => this.responseJson = res
      );
      this.error_msg = "";
    }
    else
    {
      this.error_msg = "One or more fields are missing";
    }
    
  }

}
