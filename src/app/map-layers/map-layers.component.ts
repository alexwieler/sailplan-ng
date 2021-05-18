import { Component, Input, OnInit } from '@angular/core';
import layers from './layers';
import { MapLayer } from './map-layer';
@Component({
  selector: 'app-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.css']
})
export class MapLayersComponent implements OnInit {

  layers: MapLayer[];
  @Input() map: mapboxgl.Map;

  ngOnInit(): void {
    this.layers = layers.map(Layer => new Layer(this.map));
  }
}
