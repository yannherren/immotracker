import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {PropertyPriceService} from "../services/property-price.service";
import {PropertyAtTime} from "../model/property-at-time";
import {toArray} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import * as moment from "moment";
import {LegendPosition} from "@swimlane/ngx-charts";
import {PredictionService} from "../services/prediction.service";
import {curveMonotoneX} from "d3-shape";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  LegendPosition = LegendPosition
  Math = Math

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  screenWidth!: number;

  startDate = moment().subtract(30, 'd').toDate();

  curveInterpolation = curveMonotoneX;

  options = this.fb.group({
    place: [{value: 'Bern', disabled: true}, Validators.required],
    areaFrom: [null],
    areaTo: [null],
    startDate: [this.startDate],
    endDate: [new Date()],
    selectedRoomCount: [[2, 2.5], Validators.required],
    predictionsEnabled: [false],
    predictionDayCount: [2]
  });

  data?: [
    {
      name: string;
      series: {
        name: string;
        value: any
      }[]
    }
  ]

  colorScheme = {
    domain: ['#ED6663', '#B52B65', '#CFC0BB', '#7aa3e5', '#3C2C3E', '#59405C']
  };

  roomOptions: number[] = []

  optionsOpenMobile = false;

  additionalStatistics: {
    name: string,
    value: any
  }[] = [];

  constructor(private readonly propertyPriceService: PropertyPriceService,
              private readonly fb: FormBuilder,
              private readonly predictionService: PredictionService
              ) {
  }

  async ngOnInit() {
    await this.loadData()
    this.roomOptions = await this.propertyPriceService.getRoomSizes();
  }

  async loadData() {
    const dataByRooms = await this.propertyPriceService.getPropertiesByRooms(
      this.options.value.selectedRoomCount as number[],
      this.options.value.place as string,
      this.options.value.startDate as Date,
      this.options.value.endDate as Date,
      this.options.value.areaFrom ? this.options.value.areaFrom : 0,
      this.options.value.areaTo ? this.options.value.areaTo : 1000,
    );

    this.additionalStatistics = [];
    this.data = [] as any;

    const counts: number[] = []
    const prices: number[] = []
    dataByRooms.forEach((value, key) => {
      const latestDate = moment.max(value.map(it => moment(it.data_timestamp))).format('YYYY-MM-DD')
      const propertiesToday = value.filter(it => it.data_timestamp === latestDate)
      counts.push(propertiesToday[0].property_count)
      prices.push(...propertiesToday.map(it => it.average_price))
    })

    this.additionalStatistics = [
      {
        name: 'Anzahl Immobilien heute',
        value: counts.reduce((a, b) => a + b, 0)
      },
      {
        name: 'Durchschnittspreis heute in CHF',
        value: Math.round(prices.reduce((a, b) => a + b, 0)  / prices.length)
      }
    ]

    dataByRooms.forEach((value, key) => {
      this.data?.push({
        name: key.toString(),
        series: value.map(it => {
          return {
            name: it.data_timestamp,
            value: it.average_price
          }
        })
      })
    })

    if (this.options.value.predictionsEnabled) {
      const days = this.options.value.predictionDayCount
      this.createPrediction(dataByRooms, days as number);
    }

  }

  createPrediction(dataByRooms: Map<number, PropertyAtTime[]>, days: number) {
    dataByRooms.forEach((value, rooms) => {
      const prices = value.map(prop => prop.average_price);
      const dates = value.map(prop => prop.data_timestamp);
      const latestPrice = prices[prices.length - 1]
      const latestDate = dates[prices.length - 1]
      let predictedPrices = this.predictionService.predictPrices(prices, dates, days)
      predictedPrices.unshift({
        price: latestPrice,
        date: latestDate,
      })

      predictedPrices = predictedPrices.sort((a, b) => moment(a.date).valueOf() > moment(b.date).valueOf() ? 1 : -1)

      this.data?.push({
        name: 'Vorhersage: ' + rooms,
        series: predictedPrices.map(it => {
          return {
            name: it.date,
            value: it.price
          }
        })
      })
    })
  }

  formatPrice(value: any) {
    return value + ' CHF'
  }

  formatDate(value: any) {
    return moment(value).format('DD.MM.YYYY')
  }
}
