import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { FormControl, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  currentUser: any;  

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  contactform = this.fb.group({
    name: '',
    email: '',
    message: ''
  });

  constructor(private breakpointObserver: BreakpointObserver, public auth: AuthService, private http: HttpClient, public router: Router, private fb: FormBuilder) {
    
  }

  ngOnInit(){

  }

  onSubmit(){
    if (this.contactform.value.name && this.contactform.value.email && this.contactform.value.message)
    {
      console.log('Form has been submitted', this.contactform.value);
      this.contactform.reset();
    }
    else
    {
      alert("Please make sure to fill out all fields before sending");
    }
  }
}
