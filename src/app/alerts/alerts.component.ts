import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from "../data.service";
import { MapService } from "../map.service";
import { VesselsService } from "../vessels.service";
import { AlertDetailComponent as AlertDetail} from "../alert-detail/alert-detail.component"

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  @Output() updateShowAlerts = new EventEmitter<boolean>();

  alerts: any;


  constructor(public vesselservice: VesselsService, public dataService: DataService, public mapService: MapService) {

    this.alerts = [

    ];

  }

  async ngOnInit() {

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Sample alerts for demo.  I put almost no thought into the structure of these alerts, we will definitely want to think about it and refactor.
    // sensorId refers to mmsi (which is the vessel unique ID).
    // sensorType can probably be removed, since this can be determined by vessel IMU data in the database.
    // the "action" field was just an preliminary idea to instruct the alerts what to do if clicked.  We can probably delete this and just always zoom/pan to the vessel or map coordinate.

    let alertsList: Array<AlertDetail> = new Array<AlertDetail>();

    alertsList.push(new AlertDetail(1, '5999038c-a876-4de7-8410-50f9642bcefe', true, 'SeaGlider 1', 'Collision Alert! - CPA < 3NM', 'focusVessel(2);'))
    alertsList.push(new AlertDetail(2, '5999038c-a876-4de7-8410-50f9642bcefe', true, 'SeaGlider 1', 'Collision Alert! - TCPA < 5min', 'focusBuoy(9);'))

      // TODO:  alert "action" can probably be removed, since action will likely always just focus on the associated vessel
      //{ alertId: 1, vesselId: '2555038c-a876-4de7-8410-50f9642dcadd', show: true, sensorType: 'Tanker', message: 'Collision Alert! - CPA < 3NM', action: 'focusVessel(2);' },
      //{ alertId: 2, vesselId: '', show: true, sensorType: 'Moored vessel', message: 'Collision Alert! - TCPA < 5min', action: 'focusBuoy(9);' },
      //{ alertId: 3, vesselId: '', show: true, sensorType: 'Vessel', message: 'Route Conflict in 5.6NM, 2.5min ahead', action: 'focusVessel(1);showRoutes(2);' },
    //];

    await delay(15000);

    // Loop through alerts and display them with a 2 second delay (for demo purposes).  Can remove this once real alerts are set up.
    for (var alert of alertsList) {
      await delay(1500);
      this.alerts.push(alert);
      this.updateShowAlerts.emit(true);
    }
  }

  dismissAlert(alertId) {
    //  TODO:  Implement dismiss alert
  }

  focusVessel(vesselId) {
    // Gets list of all SailPlan GPS vessels, from vessel service.  I was just playing with the idea here, there may be a better method
    let gpsVessels = this.vesselservice.getGpsVessels();

    // Make sure gpsVessels is an array, and then focus map to vessel
    if (Array.isArray(gpsVessels) && gpsVessels != []) {
      const result = gpsVessels.find(x => {
        if (x.hasOwnProperty('properties') && x.properties.hasOwnProperty('data') && x.properties.data.hasOwnProperty('vesselId') && x.properties.data.vesselId === vesselId) {
          return true;
        }
        else {
          return false;
        }
      });

      if (result) {
        const latLongObject = { lat: result.properties.data.latitude, long: result.properties.data.longitude };
        this.mapService.updateMapFocus(latLongObject);
      }
    }
  }
}
