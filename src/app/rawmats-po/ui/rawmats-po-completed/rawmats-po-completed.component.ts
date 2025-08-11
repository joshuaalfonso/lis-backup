import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-rawmats-po-completed',
  templateUrl: './rawmats-po-completed.component.html',
  styleUrls: ['./rawmats-po-completed.component.css']
})
export class RawmatsPoCompletedComponent {

  @Input() rawMatsPO: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() rawMaterial: any[] = [];
  

  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }


}
