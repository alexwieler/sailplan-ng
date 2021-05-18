/**
 * This is the component used to focus on an infrastructure clicked in the card view
 */
import { Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';

@Component({
  selector: 'app-infrastructureview',
  templateUrl: './infrastructureview.component.html',
  styleUrls: ['./infrastructureview.component.css']
})
export class InfrastructureviewComponent implements OnInit {

  @Input() infrastructure: any;

  map: mapboxgl.Map;
  style = 'mapbox://styles/jruytenbeek/ckjdo1l5t6uj319ndvxuzmd8i';
  infrastructure_updates: any = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  table_headers: any = ["Time received", "Position", "IMU", "Position relative to geofence"];
  
  constructor(private mapService: MapService) { }

  async ngOnInit() {

    if (this.infrastructure.hasOwnProperty('updates'))
    for (let j = 0; j < this.infrastructure.updates.length; j++)
    {
      let infrastructure_feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [Number(this.infrastructure.updates[j].long), Number(this.infrastructure.updates[j].lat)]
        },
        'properties': {
          'time': this.infrastructure.updates[j].time,
          'info': this.infrastructure.updates[j].info
        }
      }
      this.infrastructure_updates.data.features.push(infrastructure_feature);
    }  

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 16,
      center: [this.infrastructure.baselong, this.infrastructure.baselat]
    });

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    this.map.on('load', (event)=> {
      this.map.loadImage('../../assets/buoy.png', (error, image) => {
        this.map.addImage('buoy-base', image);
      });

      this.map.addSource('buoy-base', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [Number(this.infrastructure.baselong), Number(this.infrastructure.baselat)]
          },
          'properties': {
            'nickname': this.infrastructure.nickname,
            'status': this.infrastructure.status,
            'radius': this.infrastructure.radius,
            'last_update': this.infrastructure.last_update
          }
        }
      });

      this.map.addSource('infrastructure-updates', this.infrastructure_updates);

      this.map.addSource('geofence', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': this.infrastructure.geofence
              },
              'properties': {}
        }
      });

      this.map.addLayer({
        'id': 'infrastructure-updates',
        'type': 'circle',
        'source': 'infrastructure-updates',
        'minzoom': 14,
        'paint': {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': 7,
          
          'circle-color': [
            'match',
            ['get', 'info'],
            'in polygon',
            '#28B463',
            'not in polygon',
            '#943126',
            /* other */ '#ccc'
          ]
          }   
      });

      this.map.addLayer({
        'id': 'buoy-base',
        'type': 'symbol',
        'source': 'buoy-base',
        'layout': {
          'icon-image': 'buoy-base',
          'icon-size': 0.2
        }
      });

      this.map.addLayer({
        'id': 'geofence',
        'type': 'fill',
        'source': 'geofence',
        'minzoom': 10,
        'layout': {},
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.4
        }
      });

      this.map.on('click', 'buoy-base', (event) => {
        // @ts-ignore because there is an error associated to the type of geometry
        this.map.flyTo({center: event.features[0].geometry.coordinates, zoom: 16});
        new mapboxgl.Popup({className: "buoybase-popup"})
        // @ts-ignore
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML('<p>' + event.features[0].properties.nickname + '</p>' + '<p> Last update: ' + event.features[0].properties.last_update + '</p>'
        + '<p> Geofence radius: ' + event.features[0].properties.radius + ' m </p>'
        + '<a href="/myinfrastructures"> more info </a>')
        .addTo(this.map)
        
      });
    });
    
  }

}
