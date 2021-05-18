import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import * as CanvasJS from '../../assets/js/canvasjs.min.js';
import {DataService} from '../data.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  dataPoints: {};
  currentStep: any;

  chart: any;
  visibleDataPoints: any;

  updateInterval = 1500;

  dataPointLength: any;

  minDate: any;

  sensorData: any;

  sensorDictionary: any;

  sensorList: any;

  activeSensor: any;


  constructor(public httpClient: HttpClient) {

    this.activeSensor = 'MAF';
    this.sensorList = [];
    this.sensorData = {};
    this.sensorDictionary = {};

    this.dataPoints = {};

    // Why do we need these?  Remove these and see if it still populates
    this.dataPoints['CurrentA'] = [];

    this.dataPoints['VoltageA'] = [];
    this.dataPoints['MAF'] = [];

    this.httpClient.get(window.location.origin+'/assets/data/sample-vessel-data.csv', {responseType: 'text'})
      .subscribe(
        data => {
          // console.log('samplevesseldata: ', data);
          this.readVesselCSV(data);
        },
        error => {
          console.log('error: ', error);
        }
      );

    this.httpClient.get(window.location.origin+'/assets/data/vessel-data-dictionary.csv', {responseType: 'text'})
      .subscribe(
        data => {
          // console.log('vesseldatadict: ', data);
          this.readDictionaryCSV(data);
        },
        error => {
          console.log('error: ', error);
        }
      );




  }

  readVesselCSV(csv) {

    const lines = csv.split('\n');

    const result = [];

    const headers = lines[0].split(',');

    const linesLength = lines.length;

    for (let i = 1; i < linesLength; i++) {

      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        let value = currentline[j];
        let key = headers[j];

        // TODO:  remove this line if it's not necessary to remove newline characters from CSV
        key = key.replace(/(\r\n|\n|\r)/gm, '');

        obj[headers[j]] = currentline[j];

        if(i === 1){
          this.sensorList.push(headers[j]);
        }


        if (!this.sensorData.hasOwnProperty(key)){
          this.sensorData[key] = [];
        }
        if (!this.dataPoints.hasOwnProperty(key)){
          this.dataPoints[key] = [];
        }

        this.sensorData[key].push(value);


        if (typeof value === 'string') {
          let date = new Date();
          date.setMinutes(date.getMinutes() - linesLength + i);

          this.dataPoints[key].push({
            x: date,
            y: parseFloat(value),
          });
        }

      }


      result.push(obj);

    }

    this.sensorList.sort();

    console.log('dataPoints: ', this.dataPoints);

    this.chart.render();

    // return lines;

  }



  readDictionaryCSV(csv) {

    const lines = csv.split('\n');

    const result = [];

    const headers = lines[0].split(',');

    const linesLength = lines.length;


    for (let i = 1; i < linesLength; i++) {

      const obj = {};
      const currentline = lines[i].split(',');




      for (let j = 0; j < headers.length; j++) {
        let key = headers[j].trim();

        // TODO:  remove this line if it's not necessary to remove newline characters from CSV
        key = key.replace(/(\r\n|\n|\r)/gm, '');
        obj[key] = currentline[j];
      }

      this.sensorDictionary[currentline[0]] = obj;

      result.push(obj);

    }

    console.log('sensorDictionary: ', this.sensorDictionary);

    this.chart.render();

    // return lines;

  }

  ngOnInit(): void {



    function toggleDataSeries(e) {
      if (typeof(e.dataSeries.visible) === 'undefined' || e.dataSeries.visible ){
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      this.chart.render();
    }


    const color1 = '#42658a';
    const color2 = '#C24642';



    this.chart = new CanvasJS.Chart('chartContainer', {

      // zoomEnabled: true,
      // zoomType: 'x',
      animationEnabled: true,
      animationDuration: 2000,
      title: {
        // text: "Vessel Measurements"
      },

      axisY: {
        title: '',
        // minimum: 10,
        // maximum: 22,

        lineColor: color1,
        tickColor: color1,
        labelFontColor: color1,
        titleFontColor: color1,

      },
      // axisY2: {
      //   title: 'Fuel (mt/hr)',
      //   minimum: 0,
      //   maximum: 2.5,
      //
      //   lineColor: color2,
      //   tickColor: color2,
      //   labelFontColor: color2,
      //   titleFontColor: color2,
      // },
      axisX: {
        title: 'Time (UTC)',
        interval: 10,
        intervalType: 'minute',
        valueFormatString: "UTC:HH:mm",

        labelAngle: -20,

        // viewportMinimum: this.minDate
      },


      toolTip: {
        shared: 'true',
      },
      legend: {
        cursor: 'pointer',
        itemclick : toggleDataSeries
      },
      data: [{
        markerSize: 0,
        yValueFormatString: '#.##',
        xValueFormatString:"UTC:YYYY-MM-DD HH:mm K",
        type: 'spline',
        color: color1,
        showInLegend: true,
        // dataPoints: this.dataPoints.speed
        dataPoints: []
      }
      // ,
      //   {
      //     markerSize: 0,
      //     yValueFormatString: '#.##',
      //     axisYType: 'secondary',
      //     interval: 0.1,
      //     color: color2,
      //     showInLegend: true,
      //     name: 'Fuel (mt/hr)',
      //     type: 'spline',
      //     // dataPoints: this.dataPoints.speed
      //     dataPoints: dataPointsFuel
      //   }
        ]
    });
    this.chart.render();

    this.setGraphSensor('MAF');
  }


  setGraphSensor(sensorName){
    this.activeSensor = sensorName;
    this.chart.options.data[0].dataPoints = this.dataPoints[this.activeSensor];
    this.chart.options.axisY.title = this.sensorDictionary[this.activeSensor].units;
    this.chart.options.data[0].name = this.activeSensor;
    this.chart.options.data[0].yValueFormatString = '#.## ' + this.sensorDictionary[this.activeSensor].units;
    this.chart.render();
  }




}
