import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { AuthService } from '../auth.service';
import { RoutesService } from '../routes.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-vesselview',
  templateUrl: './vesselview.component.html',
  styleUrls: ['./vesselview.component.css']
})

export class VesselviewComponent implements OnInit {

  @Input() vessel: any;

  map: mapboxgl.Map;
  style = 'mapbox://styles/jruytenbeek/ckjdo1l5t6uj319ndvxuzmd8i';
  showrouteplanning: boolean = false;

  id: any;

  table_headers: any = ["# of Waypoints", "Start Time", "Expected Finish Time", "Average Speed", "Total distance", "Total time"];

  routeTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;

  routepoints: any = {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': []
      }
    }
  };

  waypoints: any = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  routes: any = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  raw_routes: any;

  singleroute: any;
  showsingleroute: boolean = false;

  constructor(private mapService: MapService, private fb: FormBuilder, private http: HttpClient, public auth: AuthService, public routeService: RoutesService) {
    this.auth.userProfile$.subscribe(res => this.id = res);
  }

  async ngOnInit() {



    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 2,
      center: [-96, 37.8]
    });

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    this.touchedRows = [];
    this.routeTable = this.fb.group({
      tableRows: this.fb.array([])
    });


    this.map.on('load', (event) => {


      this.map.loadImage('../../../assets/waypoint.png', (error, image) => {
        this.map.addImage('waypoint', image);
      });

      this.map.addSource('route', this.routepoints);

      this.map.addSource('waypoints', this.waypoints);

      this.map.addSource('allroutes', this.routes);

      this.map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#888',
        'line-width': 8
        }
      });

      this.map.addLayer({
        'id': 'waypoints',
        'type': 'symbol',
        'source': 'waypoints',
        'layout': {
          'icon-image': 'waypoint',
          'icon-size': 0.1,
          'icon-allow-overlap': true
        }
      });

      this.map.addLayer({
        'id': 'allroutes',
        'type': 'line',
        'source': 'allroutes',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': '#175482',
          'line-width': 5
          }
      })

      this.map.on('click', (e) => {
        if (this.showrouteplanning)
        {
          this.addRowNData(e.lngLat.lat, e.lngLat.lng);
        }
      });

      this.map.on('click', 'allroutes', (e) => {

        this.map.flyTo({
          //@ts-ignore
          center: e.features[0].geometry.coordinates[0],
          zoom: 10
        });
        new mapboxgl.Popup()
        //@ts-ignore
        .setLngLat(e.features[0].geometry.coordinates[0])
        .setHTML(e.features[0].properties.date)
        .addTo(this.map);
      });

      this.routeService.loadAll();

      this.routeService.routes.subscribe(data => {

       this.raw_routes = data;

       data.forEach(savedroute => {

          if (savedroute != "default")
          {
            let savedroutepoints = [];
            //@ts-ignore
            savedroute.routepoints.forEach(element => {
              savedroutepoints.push([element.long, element.lat])
            });

            let route = {
              'type': 'Feature',
              'properties': {
                //@ts-ignore
                'date': savedroute.date_created
              },
              'geometry': {
                'type': 'LineString',
                //@ts-ignore
                'coordinates': savedroutepoints
              }
            }
            this.routes.data.features.push(route);
            (this.map.getSource('allroutes') as mapboxgl.GeoJSONSource).setData(this.routes.data);
          }
        });
      });

    });
  }

  ngAfterOnInit(){
    this.control = this.routeTable.get('tableRows') as FormArray;
  }

  initiateForm(lat, long): FormGroup {
    const control =  this.routeTable.get('tableRows') as FormArray;
    if (control.controls.length > 0 && lat && long)
    {
      var distance = this.getDistanceFromLatLonInNM(control.controls[control.controls.length - 1].value.lat, control.controls[control.controls.length - 1].value.long, lat, long);
      var time: number = distance / control.controls[control.controls.length - 1].value.speed;
    }
    else
    {
      var distance = 0;
      var time: number = 0;
    }
    return this.fb.group({
      lat: [lat, Validators.required],
      long: [long, [Validators.required]],
      speed: ['30', [Validators.required]],
      dist: [distance],
      time: [time],
      isEditable: [true]
    })
  }

  addRow() {
    if (this.routeTable.valid)
    {
      let control =  this.routeTable.get('tableRows') as FormArray;

      if (control.controls.length > 0)
      {
        if (control.controls[control.controls.length - 1].value.isEditable && control.controls[control.controls.length - 1].status == "VALID")
        {

          this.doneRow(this.getFormControls.controls[control.controls.length - 1] as FormGroup)

        }
      }
      control.push(this.initiateForm('', ''));


    }
    else
    {
      alert("Input lat, long, and speed to proceed")
    }


  }

  addRowNData(lat, long) {

    const control =  this.routeTable.get('tableRows') as FormArray;

    if (this.routeTable.valid)
    {
      const control =  this.routeTable.get('tableRows') as FormArray;

      let point = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [long, lat]
        }
      };


      this.waypoints.data.features.push(point);
      (this.map.getSource('waypoints') as mapboxgl.GeoJSONSource).setData(this.waypoints.data);
      if (control.controls.length > 0)
      {
        if (control.controls[control.controls.length - 1].value.isEditable && control.controls[control.controls.length - 1].status == "VALID")
        {
          this.doneRow(this.getFormControls.controls[control.controls.length - 1] as FormGroup)

        }
      }

      this.routepoints.data.geometry.coordinates.push([long, lat])

      if (this.routepoints.data.geometry.coordinates.length > 1)
      {
        (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(this.routepoints.data);
      }

      control.push(this.initiateForm(lat, long));
    }
    else
    {
      alert("Input lat, long, and speed to proceed")
    }
  }

  isLastRow(index: number){

    const control =  this.routeTable.get('tableRows') as FormArray;

    if (index == control.controls.length - 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  deleteRow(index: number) {

    const control =  this.routeTable.get('tableRows') as FormArray;

    if (index == control.controls.length - 1)
    {
      control.removeAt(index);



      if (this.routepoints.data.geometry.coordinates.length == control.controls.length + 1)
      {
        this.routepoints.data.geometry.coordinates.pop();
        (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(this.routepoints.data);

      }


      this.waypoints.data.features.pop();
      (this.map.getSource('waypoints') as mapboxgl.GeoJSONSource).setData(this.waypoints.data);
    }
    else
    {
      alert("Remove next points on route in order to remove this point");
    }

    if (control.controls.length == 0)
    {
      this.showrouteplanning = false;
    }
  }



  doneRow(group: FormGroup) {


    const control =  this.routeTable.get('tableRows') as FormArray;
    if (this.routeTable.valid)
    {
      group.get('isEditable').setValue(false);

      if (control.controls.length > 0 && control.controls.length != this.routepoints.data.geometry.coordinates.length)
      {

        this.routepoints.data.geometry.coordinates.push([control.controls[control.controls.length - 1].value.long, control.controls[control.controls.length - 1].value.lat])
        console.log(this.routepoints.data.geometry.coordinates.length);
        if (control.controls.length > 1)
        {
          (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(this.routepoints.data);
        }
      }


      if (control.controls.length != this.waypoints.data.features.length - 1)
      {

        let point = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [control.controls[control.controls.length - 1].value.long, control.controls[control.controls.length - 1].value.lat]
          }
        };

        this.waypoints.data.features.push(point);
        (this.map.getSource('waypoints') as mapboxgl.GeoJSONSource).setData(this.waypoints.data);
      }

    }
    else
    {
      alert("One or more fields are missing. Please be sure to complete all fields")
    }

  }

  saveUserDetails() {
    console.log(this.routeTable.value);
  }

  get getFormControls() {
    const control = this.routeTable.get('tableRows') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.routeTable.get('tableRows') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    if (this.routeTable.valid && control.controls.length > 0)
    {
      console.log(this.routeTable.value.tableRows)
      this.http.post<any>(`${environment.baseUrl}/vessels/addroute`, {userid: this.id.sub, route: this.routeTable.value.tableRows}).subscribe(
        response => {
          console.log(response);
          this.routeService.loadAll();

        },
        error => console.log('error creating route')
      );
      this.showrouteplanning = false;
      this.map.removeLayer('waypoints');
      this.map.removeLayer('route');

      let i = 0;
      control.controls.forEach((element) => {
        control.removeAt(i);
        i++;
      });
      this.routepoints.data.geometry.coordinates = [];
      this.waypoints.data.features = [];


    }
    else
    {
      alert("Make sure that all fields are complete before submitting route")
    }
  }

  toggleTheme() {
    this.mode = !this.mode;
  }

  getDistanceFromLatLonInNM(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c /1.852; // Distance in nautical miles
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  showPlanning(){
    this.showrouteplanning = true;
  }

  routeFocus(route){
    this.map.flyTo({
      center: [route.routepoints[0].long, route.routepoints[0].lat],
      zoom: 10
    })
  }
}
