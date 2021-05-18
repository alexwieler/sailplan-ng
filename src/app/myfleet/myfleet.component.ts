import { Component, OnInit } from '@angular/core';
import { VesselsService } from '../vessels.service'

@Component({
  selector: 'app-myfleet',
  templateUrl: './myfleet.component.html',
  styleUrls: ['./myfleet.component.css']
})
export class MyfleetComponent implements OnInit {

  vessels: any;
  singlevesselview: boolean;
  showform: boolean;
  singlevessel: any;

  constructor(public vesselservice: VesselsService) {
    this.singlevesselview = false;
    this.showform = false;
  }

  ngOnInit() {
    

    this.vesselservice.vessels.subscribe(data => {
      this.vessels = data;
    });
    this.vesselservice.loadAll();
  }

  show(){
    this.showform = true;
  }

  showsinglevessel(vesseldata: any){
    this.singlevesselview = true;
    this.singlevessel = vesseldata;
  }

  showallvessels(){
    this.singlevesselview = false;
    
  }
}
