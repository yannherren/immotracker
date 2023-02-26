import { Injectable } from '@angular/core';
import SimpleLinearRegression from 'ml-regression-simple-linear';
import moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor() { }

  predictPrices(prices: number[], dates: string[], dayCount: number): {price: number, date: string}[] {
    const predictions: {price: number, date: string}[] = [];

    for (let i = 1; i <= dayCount; i++) {
      const futureDate = moment(dates.reverse()[0]).add(1, 'days').valueOf();
      const regression = new SimpleLinearRegression(dates.map(date => moment(date).valueOf()), prices);
      const prediction = regression.predict(futureDate);
      prices.push(prediction);
      dates.push(moment(futureDate).format('YYYY-MM-DD'))
      predictions.push({price: prediction, date: moment(futureDate).format('YYYY-MM-DD')})
    }

    return predictions;
  }
}
