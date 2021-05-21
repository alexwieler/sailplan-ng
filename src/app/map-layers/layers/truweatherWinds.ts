import { BaseLayer } from "./baseLayer";
import { environment } from '../../../environments/environment';

export default class EncSoundgLayer extends BaseLayer {
    displayName = 'Surface Winds';
    ledgend: HTMLImageElement = null;

    initLedgend(): void{
        const ledgends = document.getElementById("ledgend-container")
        const ledgend = document.createElement('img')
        this.ledgend = ledgend;
        ledgend.src = `${environment.baseUrl}/data/wind/ledgend`;
        ledgend.style.display = 'inline';
        ledgends.appendChild(ledgend);
    }

    toggleLedgend(): void{
        if (!this.ledgend){
            this.initLedgend();
        }else if (this.ledgend.style.display === 'none'){
            this.ledgend.style.display = 'inline';
        }else {
            this.ledgend.style.display = 'none';
        }
    }

    toggleVisibility(): void{
        this.toggleLedgend();
        super.toggleVisibility();
    }

    init(): void{
        this.addSource('truweather_winds', {
            type: 'raster',
            tiles: [
                `${environment.baseUrl}/data/wind?x={x}&y={y}&zoom={z}&tileSize=500`
            ],
            tileSize: 500
        });
        this.addLayer({
            id: 'truweather_winds_layer',
            type: 'raster',
            source: 'truweather_winds',
            //minzoom: 5,
            paint: {
                'raster-opacity': .4
            }
        });
    }
}
