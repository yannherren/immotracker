// export interface PropertyAtTime {
//   price_chf: number;
//   timestamp: string;
//   property: {
//     rooms: number;
//     area: number;
//     place: string;
//   }
// }

export interface PropertyAtTime {
  rooms: number;
  average_price: number;
  data_timestamp: string;
  property_count: number;
}
