import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-completed-contract-table',
  templateUrl: './completed-contract-table.component.html',
  styleUrls: ['./completed-contract-table.component.css']
})
export class CompletedContractTableComponent {

  selectedContract: any;

  @Input() view: boolean = false;
  @Input() insert: boolean = false;
  @Input() edit: boolean = false;
  @Input() generateReport: boolean = false;
  @Input() isLoading: boolean = false;

  @Input() contract: any[] = [];


  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

  getDate(date: {date: string}) {
    if (!date) return 'No Data';

    let dateValue = new Date(date.date).toLocaleDateString();
    let noDate = new Date('1/1/1900').toLocaleDateString();

    if (dateValue == noDate) {
        return 'No Data'
    }

    return dateValue;
  }

}
