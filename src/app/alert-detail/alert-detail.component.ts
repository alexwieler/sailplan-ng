import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-detail',
  templateUrl: './alert-detail.component.html',
  styleUrls: ['./alert-detail.component.css']
})
export class AlertDetailComponent implements OnInit {

  alertId: number;
  vesselId: string;
  show: boolean;
  sensorType: string;
  message: string;
  action?: string; //allows null/undef

  constructor(
    @Inject(Number) alertId: number,
    @Inject(String) vesselId: string,
    @Inject(Boolean) show: boolean,
    @Inject(String) sensorType: string,
    @Inject(String) message: string,
    @Inject(String) action?: string
  ) {
    this.alertId = alertId
    this.vesselId = vesselId
    this.show = show
    this.sensorType = sensorType
    this.message = message
    this.action = action
  }

  ngOnInit(): void {

  }
}
