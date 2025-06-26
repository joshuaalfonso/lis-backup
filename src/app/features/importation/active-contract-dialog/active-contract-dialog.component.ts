import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ContractPost } from 'src/app/pages/importation/importation.model';
import { ImportationService } from 'src/app/pages/importation/importation.service';
import { ActiveContractList } from '../active-contract-table/active-contract.model';

@Component({
  selector: 'app-active-contract-dialog',
  templateUrl: './active-contract-dialog.component.html',
  styleUrls: ['./active-contract-dialog.component.css']
})
export class ActiveContractDialogComponent implements OnDestroy, OnChanges{

    submitContractLoading: boolean = false;

    @Input() rawMaterial: any[] = [];
    @Input() visible: boolean = false;
    @Input() supplier: any[] = [];
    @Input() portOfDischarge: any[] = [];
    @Input() userID!: string;
    @Input() row!: any;

    @Output() closeDialog = new EventEmitter();
    @Output() getContract = new EventEmitter();


    packaging: Packaging[] = [
        {
            PackagingID: 1,
            Packaging: 'Containerized'
        },
        {
            PackagingID: 2,
            Packaging: 'Bulk'
        }
    ]

    packedIn: PackedIn[] = [
        {
            PackedInID: 1,
            PackedIn: 'Bulk in Container'
        },
        {
            PackedInID: 2,
            PackedIn: 'Bag'
        },
        {
            PackedInID: 3,
            PackedIn: 'Big Bags'
        }
    ]

    contractPerformaform: FormGroup = new FormGroup({
        'ContractPerformaID': new FormControl(0),
        'ContractNo': new FormControl(null, Validators.required),
        'Quantity': new FormControl(null, Validators.required),
        'EstimatedContainer': new FormControl(null, Validators.required),
        'Packaging': new FormControl(null, Validators.required),
        'PackedInID': new FormControl(null, Validators.required),
        'RawMaterialID': new FormControl(null, Validators.required),
        'SupplierID': new FormControl(null, Validators.required),
        'SupplierAddress': new FormControl(null, Validators.required),
        'PortOfDischargeID': new FormControl(null, Validators.required),
        'FromShipmentPeriod': new FormControl(null, Validators.required),
        'ToShipmentPeriod': new FormControl(null, Validators.required),
        'CountryOfOrigin': new FormControl(null, Validators.required),
        'Status': new FormControl(null), 
        'UserID': new FormControl(0),
    })

    constructor(
        private importationService: ImportationService,
        private messageService: MessageService
    ) {}
    

    ngOnChanges(): void {
        if (this.row) {
            this.contractPerformaform.setValue({
                ContractPerformaID: this.row.ContractPerformaID,
                ContractNo: this.row.ContractNo,
                Quantity: this.row.Quantity,
                EstimatedContainer: this.row.EstimatedContainer,
                Packaging: this.row.Packaging,
                PackedInID: this.row.PackedInID,
                RawMaterialID: this.row.RawMaterialID,
                SupplierID: this.row.SupplierID,
                SupplierAddress: this.row.SupplierAddress,
                PortOfDischargeID: this.row.PortOfDischargeID,
                FromShipmentPeriod: new Date(this.row.FromShipmentPeriod.date) || null,
                ToShipmentPeriod: new Date(this.row.ToShipmentPeriod.date) || null,
                CountryOfOrigin: this.row.CountryOfOrigin,
                Status: this.row.Status,
                UserID: this.userID
            })
        } else {
            this.contractPerformaform?.reset();
            this.contractPerformaform.patchValue({ContractPerformaID: 0})
        }
    }

    ngOnDestroy(): void {
        
    }

    // refetch contract
    handleGetActiveContract() {
        this.getContract.emit();
    }


    // auto fill supplier address
    onSelectSupplier(event: any) {
        if (!event.value) {
            this.contractPerformaform.patchValue({SupplierAddress: null});
            return;
        } 

        this.contractPerformaform.patchValue({
            SupplierAddress: event.value.Address
        })
    }

    //submit contract form 
    onSubmit() {
        this.submitContractLoading = true;

        const newContract: ContractPost = {
            ...this.contractPerformaform.value,
            FromShipmentPeriod: this.contractPerformaform.value.FromShipmentPeriod?.toLocaleDateString() || null,
            ToShipmentPeriod: this.contractPerformaform.value.ToShipmentPeriod?.toLocaleDateString() || null,
            Status: "Active",
            UserID: this.userID
        }

        // console.log(newContract)

        let authObs: Observable<any>;
        authObs = this.importationService.saveContract(newContract)

        authObs.subscribe(response =>{

            if( response === 1) {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Contract ' + this.contractPerformaform.value.ContractNo +  ' successfully recorded', 
                    life: 3000 
                });
                // this.clearItems();
                this.handleGetActiveContract();
                this.submitContractLoading = false;
                this.closeDialog.emit();
            } 

            else if ( response === 2) {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Contract ' + this.contractPerformaform.value.ContractNo +  ' successfully updated', 
                    life: 3000 
                });
                // this.clearItems();
                this.submitContractLoading = false;
                this.handleGetActiveContract();
                this.closeDialog.emit();
            }

            else if ( response === 0) {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Contract ' + this.contractPerformaform.value.ContractNo +  ' already exist', 
                    life: 3000 
                });
                this.submitContractLoading = false;
            }
        
        }, 
        errorMessage => {
            this.submitContractLoading = false;
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })
    }
    

}


export interface Packaging {
    PackagingID: number,
    Packaging: string
}

export interface PackedIn {
    PackedInID: number,
    PackedIn: string
}