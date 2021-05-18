import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import {BuoysService} from '../buoys.service';
import {MapService} from '../map.service';




@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})


// TODO:  Combine fleetdetails, buoydetails, bridgedetails, etc, so they all use details.component.  Use const arrays for each object type, to populate template.  Might have to reformat the data for each object type.

// TODO:  Rename this generic details component to:  details-section (make sure this refactors correctly)

export class DetailsComponent implements OnInit{

  currentUser: any;

  buoys: any;

  buoy_points: any = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  // Actual location of the center of the buoy
  buoy_bases: any = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  // Geofence is determined by the buoys
  geofences: any = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  constructor(public buoyservice:  BuoysService, private mapService: MapService) {
  }

  async ngOnInit(){
// subscribe to buoy data
    this.buoyservice.buoys.subscribe(data => {
      console.log("Received new buoy position");
      this.buoys = data;
      this.buoy_points.data.features = [];
      this.buoy_bases.data.features = [];
      this.geofences.data.features = [];

      for (let i = 0; i < this.buoys.length; i++)
      {

        if (this.buoys[i] != "default")
        {
          let buoy_base = {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [Number(this.buoys[i].baselong), Number(this.buoys[i].baselat)]
            },
            'properties': {
              'nickname': this.buoys[i].nickname,
              'status': this.buoys[i].status,
              'radius': this.buoys[i].radius,
              'last_update': this.buoys[i].last_update
            }
          }
          this.buoy_bases.data.features.push(buoy_base);

          if (this.buoys[i].hasOwnProperty('geofence'))
          {
            let geofence = {
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': this.buoys[i].geofence
              }
            };
            this.geofences.data.features.push(geofence);
          }

          if (this.buoys[i].hasOwnProperty('updates'))
          {
            for (let j = 0; j < this.buoys[i].updates.length; j++)
            {
              let buoyFeature = {
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [Number(this.buoys[i].updates[j].long), Number(this.buoys[i].updates[j].lat)]
                },
                'properties': {
                  'time': this.buoys[i].updates[j].time,
                  'info': this.buoys[i].updates[j].info
                }
              }
              this.buoy_points.data.features.push(buoyFeature);
            }
          }

        }
      }

      //load buoy data from db

    });
    this.buoyservice.loadAll();

    console.log(this.buoy_bases);
  }

  getCoordinates() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

}


