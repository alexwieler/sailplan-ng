/**
 * Component used to display the fleet page that shows the card view of the vessels
 */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-fleetpage',
  templateUrl: './fleetpage.component.html',
  styleUrls: ['./fleetpage.component.css']
})
export class FleetpageComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

}
