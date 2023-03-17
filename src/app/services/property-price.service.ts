import { Injectable } from '@angular/core';
import {SupabaseService} from "./supabase.service";
import {SupabaseClient} from "@supabase/supabase-js";
import {PropertyAtTime} from "../model/property-at-time";
import moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class PropertyPriceService {

  private supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabaseClient;
  }

  async readAllPropertyAndPrices(sizes: number[], place = 'bern', fromTime: Date, toTime: Date, areaFrom = 0, areaTo = 500): Promise<PropertyAtTime[]> {
    const result = await this.supabase.rpc('price_over_time_by_rooms', {
      'property_place' : place,
      'room_sizes': sizes,
      'area_from': areaFrom,
      'area_to': areaTo,
      'from_time': moment(fromTime).format('YYYY-MM-DD'),
      'to_time': moment(toTime).format('YYYY-MM-DD')
    })

    return result.data as PropertyAtTime[];
  }

  async getRoomSizes(): Promise<number[]> {
    const result = await this.supabase.rpc('get_room_sizes')
    return result.data.map((it: any) => it.rooms) as number[];
  }

  async getPropertiesByRooms(sizes: number[], place = 'bern', fromTime: Date, toTime: Date, areaFrom = 0, areaTo = 500): Promise<Map<number, PropertyAtTime[]>> {
    const propertyAndPrices = await this.readAllPropertyAndPrices(
      sizes, place, fromTime, toTime, areaFrom, areaTo
    );

    const dataByRooms = new Map<number, PropertyAtTime[]>;

    propertyAndPrices.forEach(propertyAtTime => {
      const currentRoomSize = propertyAtTime.rooms
      if (dataByRooms.has(currentRoomSize)) {
        dataByRooms.get(currentRoomSize)?.push(propertyAtTime)
      } else {
        dataByRooms.set(currentRoomSize, [propertyAtTime])
      }
    })

    return dataByRooms;
  }
}
