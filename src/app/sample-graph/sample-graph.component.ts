import { Component, OnInit } from '@angular/core';
import * as CanvasJS from "../../assets/js/canvasjs.min";

@Component({
  selector: 'app-sample-graph',
  templateUrl: './sample-graph.component.html',
  styleUrls: ['./sample-graph.component.css']
})
export class SampleGraphComponent implements OnInit {
  dataPoints: any;
  currentStep: any;

  chart: any;
  visibleDataPoints: any;

  updateInterval = 1500;

  dataPointLength: any;

  minDate: any;

  constructor() {

    this.visibleDataPoints = [];

    this.currentStep = 1;

    // TODO:  I will totally restructure the data population once we get sample data (I know the current data structure is not ideal)
    const dataTypes = [
      'speed',
      'fuel',
    ];
    this.dataPoints = {
      speed: [],
      fuel: [],
    };

    // dataTypes.forEach(function(dataType, index){
    //   this.dataPoints[dataType] = [];
    // });

    const sampleData = {
      speed: [],
      fuel: [],
    };

    const tripLengthHours = 20;

    for (let i = 0; i <= tripLengthHours; i++){

      // SOG
      sampleData.speed.push(this.generateRandomNumber(11, 20));

      // MT/HR
      sampleData.fuel.push(this.generateRandomNumber(0.2, 2));

    }

    this.dataPointLength = tripLengthHours;




    for (let i = 0; i <= tripLengthHours; i++){

      // let date = new Date(2020, 1, 24, i + 3, 0);
      let date = new Date();
      date.setHours(date.getHours() - tripLengthHours + i);
      // console.log(date)
      this.dataPoints.speed.push({
        x: date,
        y: sampleData.speed[i],
      });

      this.dataPoints.fuel.push({
        x: date,
        y: sampleData.fuel[i],
      });

      // dataTypes.forEach(function(dataType){
      //   this.dataPoints[dataType].push({
      //     x: sampleData.date[i],
      //     y: sampleData[dataType][i],
      //   });
      // });

    }






  }



  ngOnInit(): void {

    let minDate = new Date();
    minDate.setHours(minDate.getHours() - 24);
    minDate = this.dataPoints.speed[0].x;
    this.minDate = minDate;


    function toggleDataSeries(e) {
      if (typeof(e.dataSeries.visible) === 'undefined' || e.dataSeries.visible ){
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      this.chart.render();
    }

    // let recentHoursLimit = 12;
    //
    // let dateCutoff = new Date();
    // dateCutoff.setHours(dateCutoff.getHours() - recentHoursLimit);
    //
    // let dataPointStart = 0;
    //
    // for(var i = 1; i < this.dataPoints.speed.length; i++){
    //   let date = this.dataPoints.speed[i].x;
    //
    //   if(dateCutoff > date){
    //     console.log(date);
    //   }
    //   else{
    //     dataPointStart = i;
    //     this.dataPointLength = this.dataPointLength - i;
    //     break;
    //   }
    // }

    let dataPointsSpeed = this.dataPoints.speed.slice(0, this.currentStep);

    let dataPointsFuel = this.dataPoints.fuel.slice(0, this.currentStep);



    const color1 = '#42658a';
    const color2 = '#C24642';



    this.chart = new CanvasJS.Chart('chartContainer', {

      zoomEnabled: true,
      zoomType: 'y',
      animationEnabled: true,
      animationDuration: 2000,
      title: {
        // text: "Vessel Measurements"
      },

      axisY: {
        title: 'Speed (kts)',
        minimum: 10,
        maximum: 22,


        lineColor: color1,
        tickColor: color1,
        labelFontColor: color1,
        titleFontColor: color1,

      },
      axisY2: {
        title: 'Fuel (mt/hr)',
        minimum: 0,
        maximum: 2.5,

        lineColor: color2,
        tickColor: color2,
        labelFontColor: color2,
        titleFontColor: color2,
      },
      axisX: {
        title: 'Time (PST)',
        intervalType: 'hour',
        valueFormatString: 'HH:mm',
        labelAngle: -20,

        // TODO:  Replace this date with the dynamic first date of array
        viewportMinimum: this.minDate
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
        type: 'spline',
        color: color1,
        showInLegend: true,
        name: 'Speed (kts)',
        // dataPoints: this.dataPoints.speed
        dataPoints: dataPointsSpeed
      },
        {
          markerSize: 0,
          yValueFormatString: '#.##',
          axisYType: 'secondary',
          interval: 0.1,
          color: color2,
          showInLegend: true,
          name: 'Fuel (mt/hr)',
          type: 'spline',
          // dataPoints: this.dataPoints.speed
          dataPoints: dataPointsFuel
        }]
    });
    this.chart.render();


    const graphInterval = setInterval(() => {

      const nextStep = this.currentStep;

      // TODO:  Uncomment and change dataLength to calculate




      // if(dataPointsSpeed.length > this.dataPointLength){
      //   dataPointsSpeed.shift();
      //   dataPointsFuel.shift();
      // }

      dataPointsSpeed.push(this.dataPoints.speed[nextStep]);
      dataPointsFuel.push(this.dataPoints.fuel[nextStep]);

      this.currentStep++;

      if (this.currentStep >= this.dataPoints.speed.length){
        clearInterval(graphInterval);
      }




      this.chart.render();


    }, this.updateInterval);



  }






  private generateRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

}
