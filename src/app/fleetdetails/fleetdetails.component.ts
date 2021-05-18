import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import {BuoysService} from '../buoys.service';
import {MapService} from '../map.service';
import {VesselsService} from '../vessels.service';
import {DataService} from '../data.service';
import {RoutesService} from '../routes.service';

@Component({
  selector: 'app-fleetdetails',
  templateUrl: './fleetdetails.component.html',
  styleUrls: ['./fleetdetails.component.css']
})


export class FleetdetailsComponent implements OnInit{

  @Input() showMap: boolean;

  @Output() updateShowMap = new EventEmitter<boolean>();

  defaultComponentTitle = 'All Vessels';

  foodItems: any;

  currentUser: any;

  buoys: any;


  vessels: any;
  gpsVessels: any;

  singlevesselview: boolean;
  showform: boolean;
  singlevessel: any;

  titleText = 'Add a new vessel';
  modalBody = '<app-vesselform></app-vesselform>';


  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches),
  //     shareReplay()
  //   );

  buoy_points: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // Actual location of the center of the buoy
  buoy_bases: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // Geofence is determined by the buoys
  geofences: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  routes: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  selectedRow: any;

  message: string;
  subscription: any;

  selectedVesselName: string;

  showGraph: boolean;




  constructor(public buoyservice: BuoysService, private mapService: MapService, public vesselservice: VesselsService, public routeService: RoutesService, public dataService: DataService) {
    this.singlevesselview = false;
    this.showform = false;

    this.selectedRow = null;

    this.showGraph = false;

  }

  ngOnInit(){

    /*
    // subscribe to buoy data
    this.buoyservice.buoys.subscribe(data => {
      console.log('Received new buoy position');
      this.buoys = data;
      this.buoy_points.data.features = [];
      this.buoy_bases.data.features = [];
      this.geofences.data.features = [];

      for (let i = 0; i < this.buoys.length; i++)
      {

        if (this.buoys[i] != 'default')
        {
          const buoy_base = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [Number(this.buoys[i].baselong), Number(this.buoys[i].baselat)]
            },
            properties: {
              nickname: this.buoys[i].nickname,
              status: this.buoys[i].status,
              radius: this.buoys[i].radius,
              last_update: this.buoys[i].last_update
            }
          };
          this.buoy_bases.data.features.push(buoy_base);

          if (this.buoys[i].hasOwnProperty('geofence'))
          {
            const geofence = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: this.buoys[i].geofence
              }
            };
            this.geofences.data.features.push(geofence);
          }

          if (this.buoys[i].hasOwnProperty('updates'))
          {
            for (let j = 0; j < this.buoys[i].updates.length; j++)
            {
              const buoyFeature = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [Number(this.buoys[i].updates[j].long), Number(this.buoys[i].updates[j].lat)]
                },
                properties: {
                  time: this.buoys[i].updates[j].time,
                  info: this.buoys[i].updates[j].info
                }
              };
              this.buoy_points.data.features.push(buoyFeature);
            }
          }

        }
      }

      // load buoy data from db

    });
    this.buoyservice.loadAll();
     */

    this.vesselservice.vessels.subscribe(data => {
      this.vessels = data;
      console.log('this.vessels: ', data);
    });
    this.vesselservice.loadAll();

    this.vesselservice.gpsVessels.subscribe(data => {
      this.gpsVessels = data;
      console.log('this.gpsVessels: ', data);
    });
    this.vesselservice.getGpsVessels();

    // TODO:  Duplicate vesselservice code above to query IMU data?

    // this.routeService.routes.subscribe(data => {
    //   console.log('data', data);
    //   if(data.length == 1 && data[0].hasOwnProperty('routepoints')){
    //     this.mapService.updateMapFocus(data[0].routepoints);
    //   }
    // });

  }

  getCoordinates(): Promise<any> {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }


  show(): void{
    this.showform = true;
  }

  showsinglevessel(vesseldata: any): void{
    this.singlevesselview = true;
    this.singlevessel = vesseldata;
  }

  showallvessels(): void{
    console.log(this.vessels);
    this.singlevesselview = false;

  }

  // Highlight row when clicked
  setClickedRow(event, index, vesselId): void {

    if (this.selectedRow === index){
      if (event.target.id == 'action-button'){
        event.stopPropagation();
      }
      else{
        this.selectedRow = null;
        this.singlevessel = null;

        this.selectedVesselName = this.defaultComponentTitle;

        // Uncomment to show graph when table row is clicked
        /*
        this.showGraph = !this.showGraph;
        this.showMap = !this.showGraph;
         */

      }
    }
    else{
      this.selectedRow = vesselId;
      this.singlevessel = vesselId;

      const vessel = this.getVesselById(vesselId);

      const gpsVessel = this.getGpsVesselById(vesselId);
      console.log(gpsVessel)
      if(gpsVessel){
        let latLongObject = {lat: gpsVessel.properties.data.latitude, long: gpsVessel.properties.data.longitude};
        this.mapFocus(latLongObject);
      }

      this.selectedVesselName = vessel.nickname;

      // Uncomment to show graph when table row is clicked
      /*
      this.showGraph = true;
      this.showMap = false;
       */



    }

    this.updateShowMap.emit(this.showMap);


    this.dataService.updateData(this.singlevessel);

  }

  setShowGraph(event, index, vesselId): void{

  }

  getVesselById(vesselId){

    const vessel = this.vessels.find(obj => {
      return obj.vesselId === vesselId;
    });

    return vessel;

  //  TODO:  This should be a global service call, not a function in fleetdetails.component

  }

  getGpsVesselById(vesselId){
    const vessel = this.gpsVessels.find(obj => {
      if(obj.hasOwnProperty('properties') && obj.properties.hasOwnProperty('data')){
        return obj.properties.data.vesselId === vesselId;
      }
      else{
        return false;
      }
    });

    return vessel;
  }

  deleteVessel(vesselId: string): void{
    // TODO:  Call delete vessel service
    alert('Feature not implemented yet');
  }
  addRoute(): void{
    alert('Feature not implemented yet');
  }

  editVessel(vesselId: string){
    alert('Feature not implemented yet');
  }

  // Zoom and focus map on a latitude longitude object
  // Example:  latLongObject = {lat: 43.11443166666667, long: -70.61588833333333}
  mapFocus(latLongObject, zoomLevel = 5){
    this.mapService.updateMapFocus(latLongObject);
  }

  // TODO:  Currently working on this, unfinished
  routeFocus(vesselId) {
    /*
    this.routeService.getRouteByVesselId(this.selectedRow);

    console.log('routeFocus', vesselId)
    console.log('raw_routes',this.raw_routes);

    // TODO:  vesselId is currently an index, change to search for vesselId
    let route = this.raw_routes[vesselId];

    let latLongObject = {lat: route.routepoints[0].lat, long: route.routepoints[0].long};
    this.mapService.updateMapFocus(latLongObject);

    */
    // console.log('data', data);
    // if(data.length == 1 && data[0].hasOwnProperty('routepoints')){
    //   this.mapService.updateMapFocus(data[0].routepoints);
    // }

  }




}




