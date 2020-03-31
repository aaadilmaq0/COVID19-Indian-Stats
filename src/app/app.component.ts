import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from "@angular/core";
import * as screenfull from "screenfull";
import { DataService } from "./data.service";
import * as svgCharts from "svg-charts";
import { NgxSpinnerService } from "ngx-spinner";
import {} from "googlemaps";

declare var google: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements  AfterViewInit {
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild("fullscreenDiv") fullscreenDiv: ElementRef;

  map: google.maps.Map;

  title: string = "Indian States Corona Virus Stats ";
  lastUpdated: string = "Last Updated: 04:13, Tue 13th March, 2020"
  fullscreen: boolean = false;
  heatmap: boolean = false;
  HeatMap: google.maps.visualization.HeatmapLayer;
  markers: google.maps.Marker[] = [];
  legends:{name:string, color:string, count?:number}[]=[];
  zoomLevel: number = 5;

  constructor(private ds: DataService, private spinner: NgxSpinnerService) {}

  ngAfterViewInit() {
    setTimeout(()=>{
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {
          lat: 23.6444519,
          lng: 78.830071
        },
        zoom: this.zoomLevel,
        minZoom: 3,
        maxZoom: 19,
        controlSize: 50,
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          style: google.maps.ZoomControlStyle.SMALL
        },
        streetViewControl: false,
        panControl: true,
        gestureHandling: "cooperative",
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: [
          {
            elementType: "geometry",
            stylers: [
              {
                color: "#212121"
              }
            ]
          },
          {
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#757575"
              }
            ]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#212121"
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [
              {
                color: "#757575"
              }
            ]
          },
          {
            featureType: "administrative.country",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#9e9e9e"
              }
            ]
          },
          {
            featureType: "administrative.land_parcel",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#bdbdbd"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#757575"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
              {
                color: "#181818"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#616161"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#1b1b1b"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#2c2c2c"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#8a8a8a"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              {
                color: "#373737"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              {
                color: "#3c3c3c"
              }
            ]
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [
              {
                color: "#4e4e4e"
              }
            ]
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#616161"
              }
            ]
          },
          {
            featureType: "transit",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#757575"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                color: "#000000"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#3d3d3d"
              }
            ]
          }
        ]
      });
      if (screenfull.isEnabled) {
        screenfull.onchange(() => (this.fullscreen = !this.fullscreen));
      }
      this.make();
      this.map.addListener("zoom_changed", ()=>{
        this.check();
      });
    },2000);
  }

  toggleFullScreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle(this.fullscreenDiv.nativeElement);
    }
  }

  zoom(n: number) {
    this.map.setZoom(this.map.getZoom()+n);
  }

  check(){
    let newZoom = this.map.getZoom();
    if (
      !this.heatmap &&
      ((this.zoomLevel < 5 && newZoom >= 5) || (this.zoomLevel >= 5 && newZoom < 5))
    ){
      this.make();
    }
    this.zoomLevel = newZoom;
  }

  toggleHeatMap() {
    this.heatmap = !this.heatmap;
    this.make();
  }

  async make() {
    this.spinner.show();
    let data:any = [], err = null,  tTotal, tCured, tDeaths;
    await this.ds.getData().then(response=>{
      data=response["data"];
      this.lastUpdated= !response["lastUpdated"] ? '' : "Last Updated: "+response["lastUpdated"]+" (IST)";
      tTotal=response["tTotal"];
      tCured=response["tCured"]; 
      tDeaths=response["tDeaths"];
    }).catch(error=>err=true);
    if(err) return;
    this.clearMarkers();
    this.clearHeatMap();
    if (this.heatmap) {
      let heatmapData = [];
      data.forEach(d => {
        heatmapData.push({
          location: new google.maps.LatLng(d.lat, d.lng),
          weight: d.total
        });
      });
      this.HeatMap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      this.HeatMap.setMap(this.map);
      this.HeatMap.set("radius", 40);
    } else {
      let zoom = this.map.getZoom();
      this.legends = [];
      if (zoom < 5) {
        let infoWindowContent: string = "",
          pieValues: number[] = [],
          pieColors: string[] = [],
          pieColorList = this.ds.getColors(),
          colorIndex = 0,
          max = 0,
          maxColor = null;
        data.forEach(d => {
          if (d.total) {
            let color = pieColorList[colorIndex++];
            infoWindowContent += `<strong style="color:${color}">${d.name}</strong> : ${d.total}<br>`;
            this.legends.push({name:d.name, color:color, count:d.total});
            pieValues.push(d.total);
            pieColors.push(color);
            if (d.total > max) {
              max = d.total;
              maxColor = color;
            }
          }
        });
        infoWindowContent += `<u>Double click pie or Zoom in to go to state level</u>`;
        if (pieValues && pieColors && pieValues.length && pieColors.length) {
          let svgc = svgCharts().generatePieChartSVG(pieValues, pieColors, 300);
          svgc = svgc.split(`fill="white"`);
          svgc = svgc.join(`fill="${maxColor}"`);
          let marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(19.1757587,79.0882961),
            icon: {
              url: `data:image/svg+xml;utf-8,${encodeURIComponent(svgc)}`,
              scaledSize: new google.maps.Size(110, 110)
            }
          });
          let infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
            maxWidth: 500
          });
          infoWindow.open(this.map, marker);
          marker.addListener("click", () => {
            infoWindow.open(this.map, marker);
          });
          marker.addListener("dblclick", ()=>{
            this.map.setZoom(5);
          });
          this.markers.push(marker);
        }
      } else{
        let min = Math.min(...data.map(d=>d.total)), max = Math.max(...data.map(d=>d.total)), newMin = 20, newMax = 80;
        let pieColorList = ["#0000FF", "#0000FF", "#00FF00", "#FF0000"];
        this.legends = [
          {
            name: "Total",
            color: pieColorList[0],
            count: tTotal
          },
          {
            name: "Cured",
            color: pieColorList[2],
            count: tCured
          },
          {
            name: "Deaths",
            color: pieColorList[3],
            count: tDeaths
          }
        ]
        data.forEach(d=>{
          let scale = newMin + ((d.total-min)/(max-min)*(newMax-newMin));
          let pieValues = [], pieColors = [];
          if(d.total>0){
            pieValues.push(d.total);
            pieColors.push(pieColorList[0]);
          }
          if(d.cured>0){
            pieValues.push(d.cured);
            pieColors.push(pieColorList[2]);
          }
          if(d.death>0){
            pieValues.push(d.death);
            pieColors.push(pieColorList[3]);
          }
          let maxVal = d.total, maxIndex = 0;
          for(let i=1; i<4;i++){
            if(pieValues[i]<maxVal){
              maxVal = pieValues[i];
              maxIndex = i;
            }
          }
          let svgc = svgCharts().generatePieChartSVG(pieValues, pieColors, 300);
          svgc = svgc.split(`fill="white"`);
          svgc = svgc.join(`fill="${pieColors[maxIndex]}"`);
          let infoWindowContent = 
          `
          <strong>${d.name}</strong><br>
          <strong style="color:${pieColorList[0]}">Total Cases</strong> : ${d.total}<br>
          <strong style="color:${pieColorList[2]}">Total Cured</strong> : ${d.cured}<br>
          <strong style="color:${pieColorList[3]}">Total Deaths</strong> : ${d.death}<br>
          `;
          let marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(d.lat, d.lng),
            icon: {
              url: `data:image/svg+xml;utf-8,${encodeURIComponent(svgc)}`,
              scaledSize: new google.maps.Size(scale, scale)
            },
            opacity: 0.6
          });
          let infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
            maxWidth: 500
          });
          marker.addListener("mouseover", () => {
            infoWindow.open(this.map, marker);
          });
          marker.addListener("click", () => {
            infoWindow.open(this.map, marker);
          });
          marker.addListener("mouseout",()=>{
            infoWindow.close();
          });
          this.markers.push(marker);
        });
      }
    }
    setTimeout(()=>this.spinner.hide(),100);
  }

  clearHeatMap() {
    if (this.HeatMap) this.HeatMap.setData([]);
    this.HeatMap = null;
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
}
