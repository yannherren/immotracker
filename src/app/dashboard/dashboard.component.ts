import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {PropertyPriceService} from "../services/property-price.service";
import {PropertyAtTime} from "../model/property-at-time";
import {toArray} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import * as moment from "moment";
import {LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  LegendPosition = LegendPosition

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  screenWidth!: number;

  options = this.fb.group({
    place: [{value: 'Bern', disabled: true}, Validators.required],
    areaFrom: [null],
    areaTo: [null],
    selectedRoomCount: [[2, 2.5], Validators.required],
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

  constructor(private readonly propertyPriceService: PropertyPriceService, private readonly fb: FormBuilder, private readonly cdr: ChangeDetectorRef) {
  }

  async ngOnInit() {
    await this.loadData()
    this.roomOptions = await this.propertyPriceService.getRoomSizes();
  }

  async loadData() {
    this.additionalStatistics = [];
    const propertyAndPrices = await this.propertyPriceService.readAllPropertyAndPrices(
      this.options.value.selectedRoomCount as number[],
      this.options.value.place as string,
      this.options.value.areaFrom ? this.options.value.areaFrom : 0,
      this.options.value.areaTo ? this.options.value.areaTo : 1000,
    );

    this.data = [] as any;

    const dataByRooms = new Map<number, PropertyAtTime[]>;

    propertyAndPrices.forEach(propertyAtTime => {
      const currentRoomSize = propertyAtTime.rooms
      if (dataByRooms.has(currentRoomSize)) {
        dataByRooms.get(currentRoomSize)?.push(propertyAtTime)
      } else {
        dataByRooms.set(currentRoomSize, [propertyAtTime])
      }
    })

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
  }

  formatPrice(value: any) {
    return value + ' CHF'
  }

  formatDate(value: any) {
    return moment(value).format('DD.MM.YYYY')
  }
}
