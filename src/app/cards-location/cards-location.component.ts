import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-location',
  templateUrl: './cards-location.component.html',
  styleUrls: ['./cards-location.component.css']
})
export class CardsLocationComponent {

  @Input() row: any;

  @Input() isnightMode: any;

  vsYesterday(row: any) {

    if (row.YesterdayWeight === 0 ) return Number(0);

    let netWeight = row.TotalWeight - row.YesterdayWeight;

    let percentage = (netWeight / row.YesterdayWeight) * 100;

    return Number(percentage.toFixed(2));
  }

  getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
    if (requestWeight === 0) return 0; // Avoid division by zero
    const percentage = (served / requestWeight) * 100;
    // return Number(percentage.toFixed(2)); 

    return Math.round(percentage);
  }

  setProgress(totalWeight: number, maxCapacity: number) {
    const percentage = (totalWeight / maxCapacity) * 100;
    const circumference = 565.48; // Circumference of the circle
    const offset = circumference - (percentage / 100) * circumference;
    
    return Math.round(offset);
  }

}

