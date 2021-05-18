import { BaseLayer } from "./baseLayer";
import { environment } from '../../../environments/environment';

export default class EncSoundgLayer extends BaseLayer {
    displayName = 'Winds'

    init(){
        this.addSource('truweather_winds', {
            type: 'raster',
            tiles: [
                `${environment.baseUrl}/data/wind?bbox={bbox-epsg-3857}`
            ],
            tileSize: 500
        });
        this.addLayer({
            id: 'truweather_winds_layer',
            type: 'raster',
            source: 'truweather_winds',
            minzoom: 5,
            paint: {
                'raster-opacity': .4
            }
        });
    }
}
