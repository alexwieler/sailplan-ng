import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

import { BuoysService } from '../buoys.service';

@Component({
  selector: 'app-myinfrastructures',
  templateUrl: './myinfrastructures.component.html',
  styleUrls: ['./myinfrastructures.component.css']
})
export class MyInfrastructuresComponent implements OnInit {
  singleinfrastructureview: boolean = false;
  showform: boolean;
  buoys: any;
  singleinfrastructure: any;

  constructor(public buoyservice: BuoysService) {
    this.showform = false;
    
   }

  show() {
    this.showform = !this.showform;
  }

  ngOnInit() {
    this.buoyservice.buoys.subscribe(data => {
      this.buoys = data;
      console.log(this.buoys);
    });
    this.buoyservice.loadAll();
    
  }

  showsingleinfrastructure(infrastructuredata: any){
    this.singleinfrastructureview = true;
    this.singleinfrastructure = infrastructuredata;
  }

  showallinfrastructures(){
    this.singleinfrastructureview = false;
  }
}