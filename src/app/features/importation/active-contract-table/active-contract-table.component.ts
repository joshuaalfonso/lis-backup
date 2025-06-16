import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportationService } from 'src/app/pages/importation/importation.service';
import { ActiveContractList } from './active-contract.model';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-active-contract-table',
    templateUrl: './active-contract-table.component.html',
    styleUrls: ['./active-contract-table.component.css']
})
export class ActiveContractTableComponent implements OnInit, OnDestroy{

    // contract: ActiveContractList[] = [];
    // isLoading: boolean = false;

    selectedContract: any;

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


    @Output() showDialog = new EventEmitter();
    @Output() selectRow = new EventEmitter();
    
    subscriptions: Subscription = new Subscription;

    constructor(
        private importationService: ImportationService
    ) {}

    ngOnInit(): void {
        // this.getActiveContract();
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

    
}
