import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-landed-table',
  templateUrl: './landed-table.component.html',
  styleUrls: ['./landed-table.component.css']
})
export class LandedTableComponent implements OnInit{

  @Input() shippingTransaction: any[] = [];
  @Input() shippingTransactionIsLoading: boolean = false;

  @Input() edit: boolean = false;

  @Output() showShippingDialog = new EventEmitter();
  @Output() confirmDeleteShippingTransaction = new EventEmitter();
  @Output() confirmLandedToSailing = new EventEmitter;
  @Output() confirmLandedToPullOut = new EventEmitter;

  searchValue: string = '';

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchValue = params['search'] || '';
      
      this.searchValue = searchValue;
    });
  }


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

  trackByFn(index: number, item: any): any {
    return item.id || index; // use a unique identifier
  }

}
