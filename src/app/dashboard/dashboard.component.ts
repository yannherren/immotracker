import {Component, HostListener, OnInit} from '@angular/core';
import {PropertyPriceService} from "../services/property-price.service";
import {PropertyAtTime} from "../model/property-at-time";
import {toArray} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import * as moment from "moment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  roomOptions: number[] = []

  optionsOpenMobile = false;

  constructor(private readonly propertyPriceService: PropertyPriceService, private readonly fb: FormBuilder) {
  }

  async ngOnInit() {
    await this.loadData()
    this.roomOptions = await this.propertyPriceService.getRoomSizes();
  }

  async loadData() {
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
