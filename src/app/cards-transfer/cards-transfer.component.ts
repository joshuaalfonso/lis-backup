import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-transfer',
  templateUrl: './cards-transfer.component.html',
  styleUrls: ['./cards-transfer.component.css']
})
export class CardsTransferComponent {

  @Input() row: any; 

  today: any = new Date();
  date2: any = new Date('2024-11-14');

  compareDate(data1: any, data2: any) {

    const date1 = new Date(data1).toLocaleDateString();

    const date2 = new Date(data2).toLocaleDateString();;

    if (date1 == date2) {
      return 'Today'
    }

    return date2
  }

}
