import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-rawmats-po-table',
  templateUrl: './rawmats-po-table.component.html',
  styleUrls: ['./rawmats-po-table.component.css']
})
export class RawmatsPoTableComponent {

  @Input() rawMatsPO: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() insert: boolean = false;
  @Input() edit: boolean = false;
  @Output() openModal = new EventEmitter<void>();
  @Output() poCompleted = new EventEmitter<void>();

  position: string = 'center'

  constructor(
    private ConfirmationService: ConfirmationService
  ) {}


  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }


  confirmCompletedPO(position: string, row: any) {
    this.position = position;        

    if (!row.PurchaseOrderID) {
        alert('Unkown error occured');
        return
    }

    const purchaseOrderID = row.PurchaseOrderID;
    const po = row.PONo;

    this.ConfirmationService.confirm({
        message: `Are you sure '${po}' is now completed ?`,
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            // this.poCompleted(purchaseOrderID);
            this.poCompleted.emit(purchaseOrderID)
            // console.log((purchaseOrderID));
            
        },
        reject: () => {
            // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
        },
        key: 'positionDialog'
    });
}

}
