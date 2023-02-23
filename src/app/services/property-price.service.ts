import { Injectable } from '@angular/core';
import {SupabaseService} from "./supabase.service";
import {SupabaseClient} from "@supabase/supabase-js";
import {PropertyAtTime} from "../model/property-at-time";

@Injectable({
  providedIn: 'root'
})
export class PropertyPriceService {

  private supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabaseClient;
  }

  async readAllPropertyAndPrices(sizes: number[], place = 'bern', areaFrom = 0, areaTo = 500): Promise<PropertyAtTime[]> {
    const result = await this.supabase.rpc('price_over_time_by_rooms', {
      'property_place' : place,
      'room_sizes': sizes,
      'area_from': areaFrom,
      'area_to': areaTo
    })

    return result.data as PropertyAtTime[];
  }

  async getRoomSizes(): Promise<number[]> {
    const result = await this.supabase.rpc('get_room_sizes')
    return result.data.map((it: any) => it.rooms) as number[];
  }
}
