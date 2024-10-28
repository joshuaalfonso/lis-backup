import { Component } from '@angular/core';

@Component({
  selector: 'app-cards-transfer-loader',
  templateUrl: './cards-transfer-loader.component.html',
  styleUrls: ['./cards-transfer-loader.component.css']
})
export class CardsTransferLoaderComponent {

  events = [
    { status: 'Time Out', date: '15/10/2020 10:30' },
    { status: 'Source Arrival', date: '15/10/2020 14:00' },
    { status: 'Source Departure', date: '15/10/2020 16:15' },
    { status: 'Time In', date: '16/10/2020 10:00' }
  ];

}
