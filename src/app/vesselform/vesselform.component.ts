import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl} from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-vesselform',
  templateUrl: './vesselform.component.html',
  styleUrls: ['./vesselform.component.css']
})
export class VesselformComponent implements OnInit {

  userdata: any;
  responseJson: JSON;
  vesselform = new FormGroup({
    vesselId: new FormControl(''),
    nickname: new FormControl(''),
    country: new FormControl(''),
    captain: new FormControl(''),
    period: new FormControl('')
  });
  error_msg: string;

  constructor(public auth: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.auth.userProfile$.subscribe(
      val => {
        console.log(val)
        this.userdata = val
      }
    );

    if (this.vesselform.value.nickname && this.vesselform.value.vesselId){
        this.http.post<JSON>(`${environment.baseUrl}/vessels`, {newvessel: this.vesselform.value, auth: this.userdata}).subscribe(
        res => this.responseJson = res
      );
        this.error_msg = '';

        // TODO:  Close modal-basic.component modal.dismiss('')
      }
      else{
        this.error_msg = "One or more fields are missing";
      }
  }

}
