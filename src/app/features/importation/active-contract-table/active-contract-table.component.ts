import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportationService } from 'src/app/pages/importation/importation.service';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-active-contract-table',
    templateUrl: './active-contract-table.component.html',
    styleUrls: ['./active-contract-table.component.css']
})
export class ActiveContractTableComponent implements OnInit, OnDestroy{

    // contract: ActiveContractList[] = [];
    // isLoading: boolean = false;

    selectedContract: number = 0;

    isDeleting: boolean = false;

    @Input() view: boolean = false;
    @Input() insert: boolean = false;
    @Input() edit: boolean = false;
    @Input() generateReport: boolean = false;
    @Input() isLoading: boolean = false;

    @Input() contract: any[] = [];
    @Input() rawMaterial: any[] = [];
    @Input() supplier: any[] = [];
    @Input() portOfDischarge: any[] = [];
    @Input() userID!: string;
    @Input() selectedContractID: number = 0;


    @Output() showDialog = new EventEmitter();
    @Output() selectRow = new EventEmitter();
    @Output() onSelectContract = new EventEmitter();
    @Output() showShippingDialog = new EventEmitter();
    @Output() getContract = new EventEmitter();
    @Output() onRemoveContract = new EventEmitter();
    @Output() getShippingTransaction = new EventEmitter();
    
    subscriptions: Subscription = new Subscription;

    position: string = 'center';

    constructor(
        private importationService: ImportationService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {

    }   

    ngOnDestroy(): void {
        
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

    // contract overlay
    toggleContractOverlay(event: MouseEvent, overlay: any) {
        event.stopPropagation();
        overlay.toggle(event)
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }



    // delete contract
    onDeleteContract(contractID: any) {

        this.isDeleting = true;

        this.importationService.deleteContract(contractID).subscribe(
            response => {
                if( response === 2) {
                    this.isDeleting = false;
                    this.messageService.add({ 
                        severity: 'info', 
                        summary: 'Confirmed', 
                        detail: 'Successfully Deleted!' 
                    });
                    this.onRemoveContract.emit(contractID);
                } 
            }, error => {
                this.isDeleting = false;
                console.log(error);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'An unknown error occured', 
                    life: 3000 
                });
            }
        )

    }

    // delete contract form
    confirmDeleteContract(position: string, row: any) {
        this.position = position;        

        if (!row.ContractPerformaID) {
            alert('Unknown error occured');
            return
        }

        const contractPerformaID = row.ContractPerformaID;
        const contractNo = row.ContractNo;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete contract '${contractNo}' ?`,
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                this.onDeleteContract(contractPerformaID);
            },
            reject: () => {
                // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
            },
            key: 'positionDialog'
        });
    }

    contractCompleted(contractPerformaID: any) {

        this.importationService.ActiveToCompleted(contractPerformaID).subscribe(
            response => {
                if( response === 2) {
                    this.messageService.add({ 
                        severity: 'info', 
                        summary: 'Confirmed', 
                        detail: 'Successfully Updated!' 
                    });
                    this.onRemoveContract.emit(contractPerformaID);
                } 
            }, error => {
                console.log(error)
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'An unknown error occured', 
                    life: 3000 
                });
            }
        )

    }

    // completed contract confimation form
    confirmCompleted(position: string, row: any) {

        this.position = position;        

        if (!row.ContractPerformaID) {
            alert('Unknown error occured');
            return
        }

        const contractPerformaID = row.ContractPerformaID;
        const contractNo = row.ContractNo;

        this.confirmationService.confirm({
            message: `Are you sure contract '${contractNo}' is now completed ?`,
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                this.contractCompleted(contractPerformaID);
            },
            reject: () => {
                // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
            },
            key: 'positionDialog'
        });
        
    }

    
}
