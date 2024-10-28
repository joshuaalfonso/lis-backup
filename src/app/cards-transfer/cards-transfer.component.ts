import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-transfer',
  templateUrl: './cards-transfer.component.html',
  styleUrls: ['./cards-transfer.component.css']
})
export class CardsTransferComponent {

  @Input() row: any; 
  @Input() transferLoading: any; 

}
