import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-received',
  templateUrl: './dashboard-received.component.html',
  styleUrls: ['./dashboard-received.component.css']
})
export class DashboardReceivedComponent {

  @Input() landedShipping: any[] = [];
  @Input() receivedLoading: boolean = false;

  getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
    if (requestWeight === 0) return 0; // Avoid division by zero
    const percentage = (served / requestWeight) * 100;
    // return Number(percentage.toFixed(2)); 

    return Math.round(percentage);
  }

}
