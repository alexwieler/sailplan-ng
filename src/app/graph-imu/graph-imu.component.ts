import { Component, OnInit } from '@angular/core';
import * as CanvasJS from "../../assets/js/canvasjs.min";
import * as mapboxgl from "mapbox-gl";
import { AuthService } from "../auth.service";
import { HttpClient } from "@angular/common/http";
import { VesselsService } from "../vessels.service";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-graph-imu',
  templateUrl: './graph-imu.component.html',
  styleUrls: ['./graph-imu.component.css']
})
export class GraphImuComponent implements OnInit {

  selection: Array<string> = ["Roll", "Pitch"];
  sList: Array<string> = ["Roll", "Pitch", "Yaw", "Cog", "Sog"];
  filterHours: { [key: number]: string } = { 1: 'Last hour', 12: 'Last 12 hours', 24: 'Last 24 hours' };
  dataPoints: Map<string, any> = new Map<string, any>();
  currentStep: any;
  mSelected = false;

  id: any;
  chart: any;
  visibleDataPoints: any;
  updateInterval = 1500;

  dataPointLength: any;
  minDate: any;
  maxDate: any;

  gpsVessels: any;

  imuData: any = [];

  constructor(public auth: AuthService, private http: HttpClient) {

    this.auth.userProfile$.subscribe(res => this.id = res);

    this.visibleDataPoints = [];

    this.currentStep = 1;

  }

  ngOnInit(): void {

    // Each time the app is loaded initially, delete all existing AIS data from database collection/table.
    // We manually run a python script each time to populate the database with simulated live data.
    // Soon, we will be receiving actual live data and will not need to clear the database table each time.
    this.http.delete<any>(`${environment.baseUrl}/imu`).subscribe(
      response => {
        console.log('Clear IMU database');

        //dataPoints init, one array per graph.
        this.dataPoints = new Map<string, any>();
        for (let i = 0; i < this.selection.length; i++) {
          this.dataPoints.set(this.selection[i], []);
        }

        // TODO:  Use async / await for showAisData, instead of putting all the code in showAisData?  Maybe subscribe instead?
        // Subscribe to vessel AIS data
        this.showImuData();


      },
      error => console.log('Error clearing AIS database', error)
    );
  }

  toggleSelection(arg: string) {
    console.log()
    if (this.selection.includes(arg))
      this.selection = this.selection.filter(obj => obj !== arg);
    else {
      if (this.selection.length < 2) {
        this.selection.push(arg);
      }
    }
    console.log(this.selection);
    this.chart.render();
  }


  showImuData() {

    const intervalFunction = () => {

      // End interval after a certain number of steps
      if (this.currentStep >= 200) {
        clearInterval(imuInterval);
      }

      this.currentStep++;

      this.http.get<any>(`${environment.baseUrl}/imu/latest`, { params: { userid: this.id.sub } }).subscribe(
        response => {

          console.log('imuResponse: ', response);
          const imuResponse = response;
          this.imuData = imuResponse;
          const tripLengthHours = this.imuData.length;
          this.dataPointLength = tripLengthHours;

          //dataPoints init/clear, one array per graph.
          this.dataPoints = new Map<string, any>();
          for (let i = 0; i < this.selection.length; i++) {
            this.dataPoints.set(this.selection[i], []);
          }

          var prevSystemTime = 0;

          for (let i = 0; i < tripLengthHours; i++) {

            let systemTime = this.imuData[i].systemTime;
            let date = new Date(0);
            date.setUTCSeconds(Math.floor((systemTime)));

            if (systemTime !== prevSystemTime) {

              for (let j = 0; j < this.selection.length; j++) {
                this.dataPoints.get(this.selection[j]).push({
                  x: date,
                  y: this.imuData[i][this.selection[j].toLowerCase()],
                })
              }
            }
            prevSystemTime = systemTime;
          }


          if (this.imuData != []) {

            let maxDate = new Date();
            let minDate = new Date();

            minDate = this.dataPoints.get(this.selection[0])[0].x;
            this.minDate = minDate;

            maxDate = this.dataPoints.get(this.selection[0])[this.dataPoints.get(this.selection[0]).length - 1].x;
            this.maxDate = maxDate;

            if (!this.chart) {
              this.chart = this.buildChart(this.selection[0], this.selection[1]);
            }
            this.chart.render();
          }
        },
        error => console.log('error getting IMU data', error)
      );
    };
    const imuInterval = setInterval(intervalFunction, 3000);
  }

  toggleDataSeries(e) {
    console.log(e);
    if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  changedHourFilter(item) {
    //decide if we will filter the chart here or we will call to imu/latest (sending as a parameter how many hours)
    let maxDate = new Date();
    let minDate = new Date();

    minDate.setHours(minDate.getHours() - item);
    this.minDate = minDate;
    this.maxDate = maxDate;

    this.chart.render();
  }


  //first version of buildChart - up to 2 graphs at once, will return a new CanvasJS chart. There is a lot of room for improvements.
  buildChart(nameFirstGraph: string, nameSecondGraph: string): any {
    const color1 = '#42658a';
    const color2 = '#C24642';
    return new CanvasJS.Chart('chartContainer', {

      title: {

      },

      axisY: {
        lineColor: color1,
        tickColor: color1,
        labelFontColor: color1,
        titleFontColor: color1,
        titleFontSize: 22,
        titleFontFamily: '"Varela Round", sans-serif',

      },
      axisY2: {
        lineColor: color2,
        tickColor: color2,
        labelFontColor: color2,
        titleFontColor: color2,
        titleFontSize: 22,
        titleFontFamily: '"Varela Round", sans-serif',
      },
      axisX: {
        title: 'Time (UTC)',
        interval: 1,
        intervalType: 'second',
        valueFormatString: 'UTC:HH:mm:ss',
        titleFontSize: 16,
        titleFontFamily: '"Varela Round", sans-serif',
        margin: 0,
        labelAngle: -20,
        viewportMinimum: this.minDate,
        viewportMaximum: this.maxDate
      },


      toolTip: {
        shared: 'true',
      },
      legend: {
        cursor: 'pointer',
        itemclick: this.toggleDataSeries
      },
      data: [{
        markerSize: 0,
        yValueFormatString: '#.##',
        xValueFormatString: 'UTC:YYYY-MM-DD HH:mm:ss K',
        type: 'spline',
        color: color1,
        showInLegend: true,
        name: nameFirstGraph,
        dataPoints: this.dataPoints.get(nameFirstGraph)
      }, {
        markerSize: 0,
        yValueFormatString: '#.##',
        axisYType: 'secondary',
        type: 'spline',
        color: color2,
        showInLegend: true,
        name: nameSecondGraph,
        dataPoints: this.dataPoints.get(nameSecondGraph)
      }
      ]
    });
  }
}
