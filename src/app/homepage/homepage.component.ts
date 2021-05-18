import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { RoutesService } from "../routes.service";
import { DataService } from "../data.service";
import { MapService } from "../map.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  showMap: boolean;

  showAlerts: boolean = false;

  showLayerWindow = true;

  viewfleet: boolean = false;

  viewinfrastructures: boolean = false;

  viewalerts: boolean = true;

  // TODO:  Refactor naming convention of currentview.  Should be "fleet", not "My Fleet"

  currentview: string;

  constructor(public auth: AuthService, private route: ActivatedRoute, public dataService: DataService, public mapService: MapService) {
    this.showMap = true;
  }

  ngOnInit(): void {
    this.showfleet();
  }

  showfleet() {
    this.viewfleet = true;
    this.viewinfrastructures = false;
    this.viewalerts = false;
    this.currentview = 'My Fleet';
  }

  showinfrastructures() {
    this.viewfleet = false;
    this.viewinfrastructures = true;
    this.viewalerts = false;
    this.currentview = 'My Infrastructures';
  }

  showalerts() {
    this.viewfleet = false;
    this.viewinfrastructures = false;
    this.viewalerts = true;
    this.currentview = 'Alerts';
  }

  updateDetailsSection(detailsSection) {
    this.dataService.updateDetailsSection(detailsSection);
  }

  receiveMessage($event) {
    this.showMap = $event;
  }

  receiveMessageShowAlerts($event) {
    this.showAlerts = $event;
  }


}
