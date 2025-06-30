import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ImportationService } from 'src/app/pages/importation/importation.service';

@Component({
  selector: 'app-sailing-table',
  templateUrl: './sailing-table.component.html',
  styleUrls: ['./sailing-table.component.css']
})
export class SailingTableComponent implements OnInit{

  @Input() shippingTransaction: any[] = [];
  @Input() shippingTransactionIsLoading: boolean = false;

  @Input() edit: boolean = false;

  @Output() showShippingDialog = new EventEmitter()
  @Output() onRemoveShipping = new EventEmitter()
  @Output() confirmDeleteShippingTransaction = new EventEmitter()

  position: string = 'center';

  visibleLandedForm: boolean = false;

  selectedShippingID: number = 0;

  searchValue: string = '';

  @ViewChild('sailingTable') sailingTable!: Table;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchValue = params['search'] || '';
      // console.log('Searchzxc:', searchValue);
      // this.filterData(searchValue)
      this.searchValue = searchValue;
    });
  }


  onSearchChange(term: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term },
      queryParamsHandling: 'merge'
    });

    // this.filterData(term);
  } 


  // filterData(search: string) {
  //   if (!search) {
  //     return
  //   }
  //   this.filteredData = this.shippingTransaction.filter(item =>
  //     Object.values(item).some(value =>
  //       value != null && // check for null and undefined
  //       value.toString().toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  // }

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

  showLandedDialog(shippingTransactionID: number) {
    console.log(shippingTransactionID)
    this.visibleLandedForm = true;
    this.selectedShippingID = shippingTransactionID;
  }

  closeLandedDialog() {
    this.selectedShippingID = 0;
    this.visibleLandedForm = false;
  }

  handeRemoveShipping(shippingTransactionID: number) {
    this.onRemoveShipping.emit(shippingTransactionID);
  }

}
