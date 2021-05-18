export class MapComponentHelper {

}

export type geoJson = {
    type: 'geojson'
    data: {
      type: 'FeatureCollection',
      features: any[]
    }
  }

export function loadMapPictures(map: any) : void {
    map.loadImage('../../assets/green_ping.png', (error, image) => {
        map.addImage('green-marker', image);
    });

    map.loadImage('../../assets/buoy.png', (error, image) => {
        map.addImage('buoy-base', image);
    });

    map.loadImage('../../assets/vessel-ais.png', (error, image) => {
        map.addImage('vessel-marker', image);
    });

    map.loadImage('../../assets/arrow-vector.png', (error, image) => {
        map.addImage('arrow-vector', image);
    });

    map.loadImage('../../assets/vessel-gps.png', (error, image) => {
        map.addImage('gps-marker', image);
    });

    map.loadImage('../../assets/vessel-mock.png', (error, image) => {
        map.addImage('gps-mock-marker', image);
    });

    map.loadImage('../../../assets/waypoint.png', (error, image) => {
        map.addImage('waypoint', image);
    });
}

export function loadMapLayers(map: any) : void{
    map.addLayer({
        id: 'vessel-markers',
        type: 'symbol',
        source: 'vessel-markers',
        layout: {
            'icon-image': ['get', 'icon'],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'rotate'],
        }
    });

    // Mapbox layer for arrow vectors (for AIS vessels)
    map.addLayer({
        id: 'arrow-vectors',
        type: 'symbol',
        source: 'arrow-vectors',
        layout: {
            'icon-image': 'arrow-vector',
            'icon-size': ['get', 'size'],
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'rotate'],
            // 'text-offset': [5, 5],
            // 'text-anchor': 'top'
        }
    });

    // Mapbox layer for SailPlan GPS vessels
    map.addLayer({
        id: 'gps-markers',
        type: 'symbol',
        source: 'gps-markers',
        layout: {
            'icon-image': ['get', 'icon'],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'rotate'],
        }
    });

    // Mapbox layer for arrow vectors for GPS vessels (not currently used).
    map.addLayer({
        id: 'arrow-vectors-gps',
        type: 'symbol',
        source: 'arrow-vectors-gps',
        layout: {
            'icon-image': 'arrow-vector',
            'icon-size': ['get', 'size'],
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'rotate'],
            // 'text-offset': [5, 5],
            // 'text-anchor': 'top'
        }
    });

    // This is for mock data, ignore for now.
    map.addLayer({
        id: 'vector-routes',
        type: 'line',
        source: 'vector-routes',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': 'white',
            'line-width': 3
        }
    });

    // This is for mock data, ignore for now.
    map.addLayer({
        id: 'allroutes',
        type: 'line',
        source: 'allroutes',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': 'white',
            'line-dasharray': [4, 4],
            'line-width': 2
        }
    });
};