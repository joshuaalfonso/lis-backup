import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-recent-binload',
  templateUrl: './dashboard-recent-binload.component.html',
  styleUrls: ['./dashboard-recent-binload.component.css']
})
export class DashboardRecentBinloadComponent {

  @Input() recentBinload: any[] = [];
  @Input() binloadLoading: boolean = false;
  @Input() selectedOption : number = 0;

 
  getClass(i: number) { 

    if (i == 0) {
        return 'bg-blue-100 text-blue-600';
    } else if ( i == 1) {
        return 'bg-yellow-100 text-yellow-600'
    } else if (i == 2) {
        return 'bg-green-100 text-green-600'
    } else if (i == 3) {
        return 'bg-indigo-100 text-indigo-600'
    }

    return ''
  }
}
