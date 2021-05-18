/**
 * Map component that loads data from the buoys and vessels and loads them on the map
 */

import { Component, OnInit, Output, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { map, mapTo } from 'rxjs/operators';
import { MapService } from '../map.service';
import { BaseFilteringStrategy } from 'igniteui-angular';
import { VesselsService } from '../vessels.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { RoutesService } from '../routes.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // TODO:  Find a way to update primary dashboard map based on buoy or vessel data (instead of creating a new map in vesselview)

  @Input() vessel: any;

  // TODO:  Delete this if we don't need to populate vessels from this page (currently populated from fleetdetails.component.ts)
  vessels: any;

  currentStep: any;

  currentGpsStep: any;

  @Output() map: mapboxgl.Map;

  routeData: any = [
    [-70.61169616666666, 41.505941666666665],
    [-70.60963183333334, 41.50600883333333],
    [-70.60752, 41.50615416666667],
    [-70.6053875, 41.50634083333333],
    [-70.603222, 41.506547],
    [-70.6010275, 41.506749],
    [-70.59883133333334, 41.506976333333334],
    [-70.5966485, 41.50717266666667],
    [-70.59450683333333, 41.50733116666667],
    [-70.59236466666667, 41.50742133333333],
    [-70.59017216666666, 41.50745033333333],
    [-70.58794566666667, 41.50750166666667],
    [-70.58573066666666, 41.50752883333333],
    [-70.58353083333333, 41.507444166666666],
    [-70.581446, 41.5070315],
    [-70.57959233333334, 41.50631583333333],
    [-70.57787783333333, 41.5054965],
    [-70.5761955, 41.50466433333333],
    [-70.5744285, 41.50400283333333],
    [-70.57267433333334, 41.5033705],
    [-70.5709605, 41.502709],
    [-70.56919033333334, 41.502028833333334],
    [-70.56736233333334, 41.5014015],
    [-70.56552616666667, 41.500773],
    [-70.56365866666667, 41.500137333333335],
    [-70.56175916666666, 41.4995255],
    [-70.55983833333333, 41.49893683333333],
    [-70.55786583333334, 41.4983385],
    [-70.55575266666666, 41.49771283333333],
    [-70.55353666666667, 41.497107166666666],
    [-70.5512565, 41.496536166666665],
    [-70.54896683333334, 41.49597283333333],
    [-70.54671466666667, 41.49539133333333],
    [-70.54451233333333, 41.49479433333333],
    [-70.54236266666666, 41.494200166666666],
    [-70.5402675, 41.49362816666667],
    [-70.53825583333334, 41.49307916666667],
    [-70.53630733333334, 41.49258016666667],
    [-70.53441883333333, 41.49232933333333],
    [-70.53258816666667, 41.49205383333334],
    [-70.53077783333333, 41.49177],
    [-70.52893983333334, 41.49148916666667],
    [-70.52707616666666, 41.49118566666667],
    [-70.52525116666666, 41.49086033333333],
    [-70.523465, 41.49049266666667],
    [-70.52165683333334, 41.49007433333333],
    [-70.519768, 41.4896],
    [-70.51781083333333, 41.48911066666667],
    [-70.51576283333333, 41.488623833333335],
    [-70.51364533333333, 41.488133166666664],
    [-70.51144483333333, 41.487626],
    [-70.509231, 41.487123833333335],
    [-70.5069985, 41.48662733333333],
    [-70.5047255, 41.48615566666667],
    [-70.50242816666666, 41.485698166666666],
    [-70.500134, 41.485234],
    [-70.49790466666667, 41.48480333333333],
    [-70.49573066666666, 41.4846615],
    [-70.49361633333334, 41.48475166666667],
    [-70.4915395, 41.484977],

  ];

  routeData2: any = [[-70.99374033333334, 41.34926466666667],
  [-70.9922955, 41.3493935],
  [-70.99079966666666, 41.3498165],
  [-70.98928466666666, 41.35047483333334],
  [-70.98765833333333, 41.35128366666667],
  [-70.985923, 41.352186833333334],
  [-70.9841075, 41.35309783333334],
  [-70.9821595, 41.35390683333333],
  [-70.98015016666666, 41.354678166666666],
  [-70.97821666666667, 41.355509],
  [-70.9765195, 41.35652233333333],
  [-70.97487366666667, 41.35758166666667],
  [-70.97327033333333, 41.35865283333333],
  [-70.97165633333333, 41.35974616666667],
  [-70.969982, 41.360647666666665],
  [-70.9683, 41.361367],
  [-70.96661, 41.362070333333335],
  [-70.96494216666666, 41.36279233333333],
  [-70.963283, 41.36345033333333],
  [-70.961601, 41.36406233333334],
  [-70.95995016666667, 41.364674666666666],
  [-70.9582965, 41.365289833333335],
  [-70.9566605, 41.36593033333333],
  [-70.95511166666667, 41.36654266666667],
  [-70.953535, 41.367158],
  [-70.951926, 41.36780533333334],
  [-70.95030983333334, 41.36854266666667],
  [-70.94870866666666, 41.3693005],
  [-70.9470685, 41.3700615],
  [-70.94542866666667, 41.37082866666667],
  [-70.9437815, 41.371579833333335],
  [-70.9421605, 41.37232266666667],
  [-70.94052433333333, 41.373055666666666],
  [-70.93884883333334, 41.373771166666664],
  [-70.93708783333334, 41.374490333333334],
  [-70.93524416666666, 41.37519183333333],
  [-70.93333866666667, 41.37590483333334],
  [-70.93142766666666, 41.376668],
  [-70.929508, 41.377474666666664],
  [-70.927601, 41.378333166666664],
  [-70.92572316666667, 41.379248833333335],
  [-70.9238485, 41.38020983333333],
  [-70.92196416666667, 41.381229],
  [-70.920104, 41.3822515],
  [-70.9182695, 41.383204666666664],
  [-70.916446, 41.384088166666665],
  [-70.91466183333333, 41.384961833333335],
  [-70.9129075, 41.3858065],
  [-70.911202, 41.38660816666667],
  [-70.90957116666667, 41.3873755],
  [-70.907991, 41.388140166666666],
  [-70.90642916666667, 41.388874333333334],
  [-70.90493066666667, 41.38954483333333],
  [-70.90348433333334, 41.390161166666665],
  [-70.902133, 41.3907685],
  [-70.90078083333333, 41.39146733333333],
  [-70.8993175, 41.3922555],
  [-70.89778983333333, 41.393112],
  [-70.8961395, 41.3939785],
  [-70.89446233333334, 41.394910833333334],
  ];

  routeData3: any = [[-70.85848883333334, 41.53872],
  [-70.85834533333333, 41.537097833333334],
  [-70.85864016666666, 41.5355055],
  [-70.8593215, 41.533994],
  [-70.860306, 41.53257516666667],
  [-70.86154283333333, 41.53125716666667],
  [-70.862967, 41.530038833333336],
  [-70.86454616666667, 41.52890216666667],
  [-70.86628416666667, 41.52783133333333],
  [-70.86815, 41.52681616666667],
  [-70.87007633333333, 41.525784],
  [-70.87187, 41.52462466666667],
  [-70.87347533333333, 41.523399],
  [-70.875066, 41.52220233333333],
  [-70.87666066666667, 41.5210235],
  [-70.87821766666667, 41.51983933333333],
  [-70.87976983333333, 41.51865016666667],
  [-70.88134483333333, 41.517465333333334],
  [-70.882921, 41.51629466666667],
  [-70.884494, 41.515151833333334],
  [-70.88612716666667, 41.514058],
  [-70.88782433333333, 41.513015],
  [-70.88957666666667, 41.512016833333334],
  [-70.8913625, 41.511010166666665],
  [-70.893058, 41.510043333333336],
  [-70.89481616666667, 41.509056333333334],
  [-70.896631, 41.50801466666667],
  [-70.89849266666667, 41.506908833333334],
  [-70.900317, 41.505729333333335],
  [-70.9021255, 41.50449583333333],
  [-70.90383283333334, 41.503159333333336],
  [-70.90542066666667, 41.50174366666667],
  [-70.906966, 41.500305833333336],
  [-70.90842633333334, 41.498834333333335],
  [-70.9099405, 41.497446333333336],
  [-70.91147283333333, 41.496221166666665],
  [-70.91300383333333, 41.49510716666666],
  [-70.91447733333334, 41.494024833333334],
  [-70.91589333333333, 41.4929405],
  [-70.917262, 41.49184066666667],
  [-70.9186215, 41.4907515],
  [-70.91996666666667, 41.48967866666667],
  [-70.92140116666667, 41.48859516666667],
  [-70.92288783333333, 41.4874535],
  [-70.92441283333334, 41.48624866666667],
  [-70.92586616666667, 41.484899666666664],
  [-70.9271925, 41.483466666666665],
  [-70.92861133333334, 41.482067],
  [-70.92980983333334, 41.48056733333333],
  [-70.93084066666667, 41.479023166666664],
  [-70.93182283333333, 41.47745466666667],
  [-70.93275566666667, 41.475884],
  [-70.93359183333334, 41.474324],
  [-70.9344135, 41.47278633333333],
  [-70.93522666666667, 41.471265],
  [-70.93603366666666, 41.469760666666666],
  [-70.9368745, 41.468278166666664],
  [-70.9377885, 41.46680966666667],
  [-70.9386995, 41.465348],
  [-70.93958516666666, 41.46387033333333],
  ];

  // These are mock routes, that were only used to record demo video.  Will not be needed for the actual app
  mockRouteData: any = [
    [
      -70.66886901855469,
      41.48800607185427
    ],
    [
      -70.68740844726562,
      41.47617465855341
    ],
    [
      -70.7080078125,
      41.46434108514979
    ],
    [
      -70.72723388671875,
      41.45559314261393
    ],
    [
      -70.74508666992188,
      41.445299934803955
    ],
    [
      -70.75881958007812,
      41.43963797438235
    ],
    [
      -70.79109191894531,
      41.425223482352656
    ],
    [
      -70.81443786621094,
      41.415440397070626
    ],
    [
      -70.83984375,
      41.40308070920773
    ],
    [
      -70.8673095703125,
      41.393809400281555
    ],
    [
      -70.89340209960938,
      41.38814294931545
    ],
    [
      -70.92018127441406,
      41.38556712651267
    ],
    [
      -70.93940734863281,
      41.3850519497068
    ],
    [
      -70.96138000488281,
      41.3850519497068
    ],
    [
      -70.97991943359375,
      41.386597467879106
    ],
    [
      -70.99571228027344,
      41.38556712651267
    ],
    [
      -71.02043151855467,
      41.38350639479881
    ],
    [
      -71.03485107421875,
      41.38350639479881
    ],
    [
      -71.05133056640625,
      41.38453676881922
    ],
    [
      -71.070556640625,
      41.3850519497068
    ],
    [
      -71.08772277832031,
      41.38711263243966
    ],
    [
      -71.10214233398438,
      41.39071867007324
    ],
    [
      -71.11656188964844,
      41.393809400281555
    ],
    [
      -71.13029479980469,
      41.39689998354142
    ],
    [
      -71.1419677734375,
      41.398960290742316
    ],
    [
      -71.15638732910156,
      41.40514082047109
    ],
    [
      -71.17149353027344,
      41.410290812880795
    ],
    [
      -71.19277954101562,
      41.41183573100123
    ],
    [
      -71.21063232421875,
      41.41183573100123
    ],
    [
      -71.22917175292969,
      41.413895564677304
    ]
  ];

  // These are mock routes, that were only used to record demo video.  Will not be needed for the actual app
  videoRoute1: any = [[-122.38494873046875, 47.615421267605434], [-122.45361328124999, 47.632081940263305], [-122.46734619140625, 47.663537612601345], [-122.44281431549749, 47.72408269646315], [-122.44281431549749, 47.72408269646315], [-122.44262695312501, 47.724544549099676], [-122.4481201171875, 47.78178908571313], [-122.46267634631099, 47.868127011557704], [-122.46267634631099, 47.868127011557704], [-122.464599609375, 47.879512933970496], [-122.4810791015625, 47.92738566360356], [-122.50579833984375, 47.94394667836214], [-122.56072998046875, 47.94946583788702], [-122.58555534707631, 47.966096144540906], [-122.58555534707631, 47.966096144540906], [-122.61016845703124, 47.98256841921405], [-122.62939453125001, 48.01381248943335], [-122.64222724352582, 48.10103516458793], [-122.64222724352582, 48.10103516458793], [-122.64587402343751, 48.125767833701666], [-122.69256591796876, 48.14776316994868], [-122.80437585953426, 48.18122171354949], [-122.80437585953426, 48.18122171354949], [-122.85186767578125, 48.19538740833338], [-123.01412264715313, 48.21579436745967], [-123.01412264715313, 48.21579436745967], [-123.01412264715313, 48.21579436745967], [-123.01412264715313, 48.21579436745967], [-123.01412264715313, 48.21579436745967], [-123.01412264715313, 48.21579436745967]];
  videoRoute2: any = [[-126.55700683593749, 48.90805939965008], [-126.40319824218751, 48.82494916931076], [-126.28027725802735, 48.79543916496746], [-126.28027725802735, 48.79543916496746], [-125.97120129297527, 48.72050580613546], [-125.97120129297527, 48.72050580613546], [-125.66304989566717, 48.64474829694425], [-125.66304989566717, 48.64474829694425], [-125.4693603515625, 48.596592251456705], [-125.3516480006697, 48.57695059190434], [-125.3516480006697, 48.57695059190434], [-125.03387986388677, 48.523250879957985], [-125.03387986388677, 48.523250879957985], [-124.71679028190641, 48.468678498889936], [-124.71679028190641, 48.468678498889936], [-124.6783447265625, 48.46199462233164], [-124.41740802840032, 48.382019237980415], [-124.41740802840032, 48.382019237980415], [-124.31030273437499, 48.34894812401375], [-124.1088219969651, 48.31323091238744], [-124.1088219969651, 48.31323091238744], [-123.79386805568559, 48.25659119938873], [-123.79386805568559, 48.25659119938873], [-123.739013671875, 48.246625590713826], [-123.47269890052848, 48.22096293691566], [-123.47269890052848, 48.22096293691566], [-123.3984375, 48.213692646648035], [-123.3984375, 48.213692646648035], [-123.3984375, 48.213692646648035], [-123.3984375, 48.213692646648035]];

  // Scrappy code, used for mock routes during demo, will be removed later
  prevCog1: any = 0;
  prevCog2: any = 0;

  // Stores AIS vessel objects, which include lat/long coordinates and other data
  vessel_markers: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // Stores arrow vectors for AIS vessels
  arrow_vectors: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // Stores GPS locations and some other information for SailPlan vessels
  gps_markers: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // We are not currently using arrow vectors for GPS, only for AIS
  arrow_vectors_gps: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // This is used for mock data, for demo purposes.  Ignore for now.
  vector_routes: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // This is used for mock data, for demo purposes.  Ignore for now.
  // Very unintuitive naming because I used some old code to throw together a quick demo.
  routes: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // Properties of mapbox map
  style = 'mapbox://styles/jruytenbeek/ckjdo1l5t6uj319ndvxuzmd8i';
  initial_lng = -96;
  initial_lat = 37.8;
  position: any;


  /*
  showrouteplanning: boolean = false;
   */

  // Current User ID (should rename, very poor naming)
  id: any;

  // Not needed.  Can't remember why this is here, but leave it for now.
  table_headers: any = ['# of Waypoints', 'Start Time', 'Expected Finish Time', 'Average Speed', 'Total distance', 'Total time'];

  control: FormArray;
  mode: boolean;

  aisData: any;

  gpsData: any;



  constructor(private route: ActivatedRoute, public _router: Router, public mapService: MapService, public vesselservice: VesselsService, private fb: FormBuilder, private http: HttpClient, public auth: AuthService, public routeService: RoutesService, public dataService: DataService) {

    this.auth.userProfile$.subscribe(res => this.id = res);

    this.aisData = {};

    this.gpsData = {};

    this.currentStep = 0;

    this.currentGpsStep = 0;

  }



  ngOnInit() {

    // TODO:  Remove this during refactor
    /*
    const view = this.route.snapshot.params.view;
    console.log(this.route.snapshot.params);
     */

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 4,
      center: [this.initial_lng, this.initial_lat]
    });

    /*
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
     */

    // This is not used, it was just here as a reminder of an idea for later.  Can delete in the future during refactoring
    /*
    this.dataService.detailsSection.subscribe(detailsSection => {
      if (detailsSection == 'viewfleet'){
        // this.dataService.updateDetailsSection(null);
      }
    });
     */

    // TODO:  Delete this if we don't need to populate vessels from this page (currently populated from fleetdetails.component.ts)
    this.vesselservice.vessels.subscribe(data => {
      this.vessels = data;
    });


    this.map.on('load', (event) => {

      // loadImage is used to load icon resources, for icons that will be used on the map
      this.map.loadImage('../../assets/green_ping.png', (error, image) => {
        this.map.addImage('green-marker', image);
      });

      this.map.loadImage('../../assets/buoy.png', (error, image) => {
        this.map.addImage('buoy-base', image);
      });

      this.map.loadImage('../../assets/vessel-ais.png', (error, image) => {
        this.map.addImage('vessel-marker', image);
      });

      this.map.loadImage('../../assets/arrow-vector.png', (error, image) => {
        this.map.addImage('arrow-vector', image);
      });

      this.map.loadImage('../../assets/vessel-gps.png', (error, image) => {
        this.map.addImage('gps-marker', image);
      });

      this.map.loadImage('../../assets/vessel-mock.png', (error, image) => {
        this.map.addImage('gps-mock-marker', image);
      });

      this.map.loadImage('../../../assets/waypoint.png', (error, image) => {
        this.map.addImage('waypoint', image);
      });

      // Sources are defined here and will be used during this.map.addLayer
      this.map.addSource('vessel-markers', this.vessel_markers);
      this.map.addSource('arrow-vectors', this.arrow_vectors);
      this.map.addSource('gps-markers', this.gps_markers);
      this.map.addSource('arrow-vectors-gps', this.arrow_vectors_gps);
      this.map.addSource('vector-routes', this.vector_routes);
      this.map.addSource('allroutes', this.routes);

      // Mapbox layer for AIS vessels
      this.map.addLayer({
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
      this.map.addLayer({
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
      this.map.addLayer({
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
      this.map.addLayer({
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
      this.map.addLayer({
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
      this.map.addLayer({
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
      // Each time the app is loaded initially, delete all existing AIS data from database collection/table.
      // We manually run a python script each time to populate the database with simulated live data.
      // Soon, we will be receiving actual live data and will not need to clear the database table each time.
      this.http.delete<any>(`${environment.baseUrl}/ais`).subscribe(
        response => {
          console.log('Clear AIS database');

          // TODO:  Use async / await for showAisData, instead of putting all the code in showAisData?  Maybe subscribe instead?
          // Subscribe to vessel AIS data
          this.showAisData();


        },
        error => console.log('Error clearing AIS database', error)
      );

      // Each time the app is loaded initially, delete all existing GPS vessel data from database collection/table.
      // We manually run a python script each time to populate the database with simulated live data.
      // Soon, we will be receiving actual live data and will not need to clear the database table each time.
      this.http.delete<any>(`${environment.baseUrl}/gps`).subscribe(
        response => {
          console.log('Clear GPS database');

          // TODO:  Use async / await for showGpsData, instead of putting all the code in showAisData?  Maybe subscribe instead?
          // Subscribe to vessel GPS data
          this.showGpsData();


        },
        error => console.log('Error clearing AIS database', error)
      );

      // Click listener for AIS vessel
      this.map.on('click', 'vessel-markers', ($event) => {

        const tableHtml = this.createTableFromList(JSON.parse($event.features[0].properties.data));

        // @ts-ignore because there is an error associated to the type of geometry
        this.map.flyTo({ center: $event.features[0].geometry.coordinates/*, zoom: 5*/ });
        new mapboxgl.Popup({ className: 'ais-popup' })
          // @ts-ignore
          .setLngLat($event.features[0].geometry.coordinates)
          .setHTML(tableHtml)
          .addTo(this.map);

      });

      // Click listener for GPS SailPlan vessel
      this.map.on('click', 'gps-markers', ($event) => {

        const tableHtml = this.createTableFromList(JSON.parse($event.features[0].properties.data));

        // @ts-ignore because there is an error associated to the type of geometry
        this.map.flyTo({ center: $event.features[0].geometry.coordinates/*, zoom: 5*/ });
        new mapboxgl.Popup({ className: 'ais-popup' })
          // @ts-ignore
          .setLngLat($event.features[0].geometry.coordinates)
          .setHTML(tableHtml)
          .addTo(this.map);

      });


    });


    // Using a service to refocus the map.  For example, clicking an alert in refocuses to relevant vessel on map.
    this.mapService.mapFocus.subscribe(latLongObject => {
      if (latLongObject != null) {
        this.mapFocus(latLongObject, 12);
      }
    });


    /*
      var line = turf.lineString(this.videoRoute1);
  
      var chunk = turf.lineChunk(line, 10, {units: 'miles'});
  
      let tempRoute = [];
      chunk.features.forEach((element) => {
        element.geometry.coordinates.forEach((latLongObj) => {
          tempRoute.push(latLongObj);
        });
      });
      console.log(tempRoute.length);
      console.log(JSON.stringify(tempRoute));
  
   */


  }

  // Zoom and focus map on a latitude longitude object
  // Example:  latLongObject = {lat: 43.11443166666667, long: -70.61588833333333}
  mapFocus(latLongObject, zoomLevel = 5) {
    this.map.flyTo({
      center: [latLongObject.long, latLongObject.lat],
      zoom: zoomLevel
    });
  }

  showAisData() {
    // Zoom into sample AIS vessel location by default
    const latLongObject = { lat: 43.11443166666667, long: -70.61588833333333 };

    /*
      Currently using interval function to fetch vessel gps data every 1 second.  This is easier for demo purposes.
      Eventually we probably want to use a better method, possibly a WebSocket.
      The current interval method may or may not be fine until June 1st deployment, we will have to decide.
    */
    const intervalFunctionAis = () => {

      // End interval after a certain number of steps.  I figured this is good for demo purposes so it doesn't keep running forever.
      if (this.currentStep >= 300) {
        clearInterval(aisInterval);
      }

      this.currentStep++;

      // Returns the latest unique batch of AIS vessels
      this.http.get<any>(`${environment.baseUrl}/ais/latest`, {params: { userid: this.id.sub }}).subscribe(
        response => {

          // console.log('aisResponse: ', response);
          const aisResponse = response;

          // Group AIS data results by ID
          // const allAisData = Array.from(new Set(aisResponse.map(a => a.id)))
          //   .map(id => {
          //     return aisResponse.find(a => a.id === id);
          //   });
          //
          // this.aisData = allAisData;

          this.aisData = aisResponse;

          this.vessel_markers.data.features = [];
          this.arrow_vectors.data.features = [];

          aisResponse.forEach((aisObject) => {

            const lat_y = Number(aisObject.y);
            const long_x = Number(aisObject.x);

            // const aisObject = aisResponse;

            let iconType = '';
            if (aisObject.type >= 1 && aisObject.type <= 3) {
              iconType = 'vessel-marker';
            }
            else if (aisObject.type === 21) {
              iconType = 'buoy-base';
            }
            else {
              iconType = 'vessel-marker';
            }
            let vesselOrientation = 0;

            if (aisObject.hasOwnProperty('true_heading') && aisObject.true_heading !== 511) {
              vesselOrientation = aisObject.true_heading;
            }
            else if (aisObject.hasOwnProperty('cog')) {
              vesselOrientation = aisObject.cog;
            }
            else {
              vesselOrientation = 0;
            }

            // aisVessel represents an single vessel which is picked up from the AIS data, which surrounds our few SailPlan vessels
            const aisVessel = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [long_x, lat_y]
              },
              properties: {
                data: aisObject,
                icon: iconType,
                rotate: vesselOrientation
              }
            };
            this.vessel_markers.data.features.push(aisVessel);

            // Assume average speed over ground is 20.  Start with 20 and divide by some multiplier
            const vectorMultiplier = 0.4;
            let vectorSize = ((aisObject.sog / 20) * vectorMultiplier);
            vectorSize = .2;

            // Only show arrow vector on AIS vessel if it has a COG direction, and speed over ground >= 1
            if (aisObject.hasOwnProperty('cog') && aisObject.sog >= 1) {
              const arrowVector = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [long_x, lat_y]
                },
                properties: {
                  rotate: aisObject.cog - 90,
                  size: vectorSize
                }
                // 'properties': aisResponse[this.currentStep]
              };
              this.arrow_vectors.data.features.push(arrowVector);

            }
          });

          // Adds the AIS vessels to the map, using the gpsVessel data
          (this.map.getSource('vessel-markers') as mapboxgl.GeoJSONSource).setData(this.vessel_markers.data);

          // Adds arrow vectors for AIS vessels to the map
          // (this.map.getSource('arrow-vectors') as mapboxgl.GeoJSONSource).setData(this.arrow_vectors.data);

        },
        error => console.log('error getting AIS data', error)
      );

    };

    const aisInterval = setInterval(intervalFunctionAis, 1000);

  }



  showGpsData() {
    // Zoom into sample GPS vessel location by default
    const latLongObject = { lat: 41.3492835, long: -70.993022 };
    // latLongObject = {lat: lat_y, long: long_x};  // Sample GPS vessel location

    // Focus map to demo area and zoom in
    this.mapFocus(latLongObject, 9);


    /*
      Currently using interval function to fetch vessel gps data every 1 second.  This is easier for demo purposes.
      Eventually we probably want to use a better method, possibly a WebSocket.
      The current interval method may or may not be fine until June 1st deployment, we will have to decide.
    */
    const intervalFunctionGps = () => {

      // End interval after a certain number of steps.  I figured this is good for demo purposes so it doesn't keep running forever.
      if (this.currentGpsStep >= 300) {
        clearInterval(gpsInterval);
      }

      this.currentGpsStep++;

      this.http.get<any>(`${environment.baseUrl}/gps/latest`, {params: { userid: this.id.sub } }).subscribe(
        response => {

          console.log('gpsResponse: ', response);
          const gpsResponse = response;

          // Group GPS data results by ID
          // const allGpsData = Array.from(new Set(gpsResponse.map(a => a.id)))
          //   .map(id => {
          //     return gpsResponse.find(a => a.id === id);
          //   });
          //
          // this.gpsData = allGpsData;

          this.gpsData = [gpsResponse];

          this.gps_markers.data.features = [];
          this.arrow_vectors_gps.data.features = [];
          this.vector_routes.data.features = [];
          this.routes.data.features = [];

          const route = this.getMockRoute(gpsResponse[0], this.routeData);
          this.routes.data.features.push(route);

          const route2 = this.getMockRoute(gpsResponse[1], this.routeData2);
          this.routes.data.features.push(route2);

          const route3 = this.getMockRoute(gpsResponse[2], this.routeData3);
          this.routes.data.features.push(route3);



          const mockRouteData = this.getMockGpsVessel(this.mockRouteData, gpsResponse[0], 40, 0);
          this.gps_markers.data.features.push(mockRouteData);


          (this.map.getSource('allroutes') as mapboxgl.GeoJSONSource).setData(this.routes.data);

          gpsResponse.forEach((gpsObject) => {

            // videoRoute1/videoRoute2/mockRouteData are mock routes, that were only used to record demo video.
            // Can delete the next 20 lines in the future since they aren't needed for actual app.  Keep for now.
            // const mockGpsVessel = this.getMockGpsVessel(this.videoRoute1, gpsObject, 60, 1);
            // this.gps_markers.data.features.push(mockGpsVessel);

            // const mockGpsVessel2 = this.getMockGpsVessel(this.videoRoute2, gpsObject, 40, 2);
            // this.gps_markers.data.features.push(mockGpsVessel2);



            gpsObject.y = gpsObject.latitude;
            gpsObject.x = gpsObject.longitude;

            const lat_y = Number(gpsObject.y);
            const long_x = Number(gpsObject.x);

            // Turfjs route line projection.  We aren't using this now but might need it in the next month, so keep the commented code here for now.
            /*
                        let aisTargetCoord = [long_x, lat_y];
                        var point = turf.point(aisTargetCoord);
                        var sog = 20 // take from AIS (assuming in knts per hour)
                        var bearing = gpsObject.cog; // take from AIS
                        var time = 60; // entered in minutes
            // I am using minutes for time in this example. This should ideally be entered by the user later on but we can hard code something for now
                        var timeHrs = time/60; // convert minutes to hours.
                        var distance = timeHrs*sog;
                        var destination = turf.destination(point, distance, bearing, {units: 'miles'});
            
                        const vectorRoute = {
                          'type': 'Feature',
                          'properties': {},
                          'geometry': {
                            'type': 'LineString',
                            'coordinates': [aisTargetCoord, destination.geometry.coordinates]
                          }
                        };
            
                        this.vector_routes.data.features.push(vectorRoute);
            
                        (this.map.getSource('vector-routes') as mapboxgl.GeoJSONSource).setData(this.vector_routes.data);
             */

            // gpsVessel represents a real vessel gps location
            const gpsVessel = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [long_x, lat_y]
              },
              properties: {
                data: gpsObject,
                rotate: gpsObject.cog,
                icon: 'gps-marker'
              }
            };

            this.gps_markers.data.features.push(gpsVessel);

            // Adds list of gps_markers to vesselservice, which is called by alerts.component.ts - this.vesselservice.getGpsVessels()
            // There's probably a better way to communicate to sibling components
            this.vesselservice.updateGpsVesselList(this.gps_markers.data.features);

            //  This block of code adds arrow vectors to the ships (vessels).  We're not using this code for now, but leave it here.
            /*
              // Assume average speed over ground is 20.  Start with 20 and divide by some multiplier
              const vectorMultiplier = 0.4;
              const vectorSize = ((gpsObject.sog / 60) * vectorMultiplier);
  
              if (gpsObject.hasOwnProperty('cog') && gpsObject.sog >= 1) {
                const arrowVector = {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [long_x, lat_y]
                  },
                  properties: {
                    rotate: gpsObject.cog - 90,
                    size: vectorSize
                  }
                  // 'properties': gpsResponse[this.currentGpsStep]
                };
                this.arrow_vectors_gps.data.features.push(arrowVector);
  
              }
            */


          });

          // Adds the vessels to the map, using the gpsVessel data
          (this.map.getSource('gps-markers') as mapboxgl.GeoJSONSource).setData(this.gps_markers.data);

          // We don't need to show arrow vectors on GPS vessels
          // (this.map.getSource('arrow-vectors-gps') as mapboxgl.GeoJSONSource).setData(this.arrow_vectors_gps.data);


        },
        error => console.log('error getting GPS data', error)
      );



    };

    const gpsInterval = setInterval(intervalFunctionGps, 500);

  }

  // This is only needed for demo purposes, you can ignore mockGpsVessel for now
  getMockGpsVessel(routeData, gpsObject, timeStep = 40, mockNum = 0) {
    var tstamp =  gpsObject === undefined ? Date.now: gpsObject.timestamp;

    const step = Math.round(tstamp / timeStep);

    // Added +1 so the line doesn't overlap with the vessel icon.
    const mockRouteData = routeData.slice(step);
    const route = {
      type: 'Feature',
      properties: {
        // 'date': savedroute.date_created
      },
      geometry: {
        type: 'LineString',
        coordinates: mockRouteData
      }
    };

    this.routes.data.features.push(route);

    let mockCog = 0;

    if (mockNum === 0) {
      mockCog = 225;

      if (step >= 8) {
        mockCog = 250 + step;
      }
    }
    else {
      mockCog = turf.bearing(mockRouteData[0], mockRouteData[1]);

      if (mockCog == 0) {
        let mockCog = turf.bearing(mockRouteData[0], mockRouteData[1]);
        if (mockNum == 1) {
          mockCog = this.prevCog1;
        }
        else if (mockNum == 2) {
          mockCog = this.prevCog2;
        }
      }
      else {
        if (mockNum == 1) {
          this.prevCog1 = mockCog;
        }
        else if (mockNum == 2) {
          this.prevCog2 = mockCog;
        }
      }
    }

    const mockGpsVessel = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: mockRouteData[0]
      },
      properties: {
        // data: gpsObject,
        rotate: mockCog,
        icon: 'gps-mock-marker'
      }
    };

    return mockGpsVessel;
  }

  // This is only needed for demo purposes, can ignore mockRoute for now
  getMockRoute(gpsObject, routeDataTemp) {
    var tstamp =  gpsObject === undefined ? Date.now: gpsObject.timestamp;
    const step = Math.round(tstamp / 20);

    // Added +1 so the line doesn't overlap with the vessel icon.
    const routeData = routeDataTemp.slice(step + 1);
    const route = {
      type: 'Feature',
      properties: {
        // 'date': savedroute.date_created
      },
      geometry: {
        type: 'LineString',
        coordinates: routeData
      }
    };

    return route;
  }


  // Converts json to HTML table
  createTableFromList(json) {

    let tableHtml = '<table>';

    for (let [key, value] of Object.entries(json)) {
      if (key == '_id' || key == '__v') {
        continue;
      }
      else if (key == 'x') {
        key = 'longitude';
      }
      else if (key == 'y') {
        key = 'latitude';
      }
      tableHtml += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
    }

    tableHtml += '</table>';
    return tableHtml;
  }

}



