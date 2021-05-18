import { MapLayer } from '../map-layer'

export abstract class BaseLayer implements MapLayer{
    displayName: string
    mapboxLayers: mapboxgl.Layer[]
    map: mapboxgl.Map
    initialized: boolean

    constructor(m: mapboxgl.Map){
        this.map = m
        this.mapboxLayers = []
    }

    abstract init():void

    addLayer(layer: mapboxgl.Layer){
        this.map.addLayer(layer)
        this.mapboxLayers.push(layer)
    }

    addSource(id, source: mapboxgl.AnySourceData){
        this.map.addSource(id, source)
    }

    toggleVisibility(){
        if(!this.initialized){
            this.init()
            this.initialized = true
        }

        for(const l of this.mapboxLayers){
            const isVisible = this.map.getLayoutProperty(
                l.id,
                'visibility'
              ) === 'visible';
          
              if (isVisible) {
                this.map.setLayoutProperty(
                    l.id,
                  'visibility',
                  'none'
                );
            } else {
                this.map.setLayoutProperty(
                    l.id,
                  'visibility',
                  'visible'
                );
            }   
        }
    }
}