import { BaseLayer } from "./baseLayer";

export default class EncSoundg extends BaseLayer {
    displayName = 'ENCs'

    init(){
        this.addSource('noaa_enc_soundg', {
            type: 'vector',
            url: 'mapbox://jruytenbeek.noaa_enc_soundg'
        });
        this.addLayer({
            id: 'noaa_enc_soundg_layer',
            type: 'symbol',
            source: 'noaa_enc_soundg',
            'source-layer': 'main',
            layout: {
                'text-field': '{DEPTH}m',
                'text-size': 10
            },
            minzoom: 12,
            paint: {
                'text-color': '#fff',
            },
        })
    }
}
