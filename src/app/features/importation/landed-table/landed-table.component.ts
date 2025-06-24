import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-landed-table',
  templateUrl: './landed-table.component.html',
  styleUrls: ['./landed-table.component.css']
})
export class LandedTableComponent {

  @Input() shippingTransaction: any[] = [];
  @Input() shippingTransactionIsLoading: boolean = false;

  @Input() edit: boolean = false;


  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

  getDate(date: {date: string}) {
    if (!date) return 'No Date';

    let dateValue = new Date(date.date).toLocaleDateString();
    let noDate = new Date('1/1/1900').toLocaleDateString();

    if (dateValue == noDate) {
        return 'No Date'
    }

    return dateValue;
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
          return 'warning';
      case 2:
          return 'info';
      case 3:
          return 'success';
      default:
          throw new Error(`Unknown status: ${status}`);
    }
  }

  getStatus(status: number) {
    switch (status) {
      case 1:
          return 'Sailing';
      case 2:
          return 'Landed';
      case 3:
          return 'PullOut';
      default:
          throw new Error(`Unknown status: ${status}`);
    }

  }

}
