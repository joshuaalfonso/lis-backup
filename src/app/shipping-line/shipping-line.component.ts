import { Component, OnDestroy, OnInit } from "@angular/core";
import { ShippingLineService } from "./shipping-line.service";
import { Subscription, Observable } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";


@Component({
    selector: 'app-shipping-line',
    templateUrl: 'shipping-line.component.html',
    styleUrls: ['shipping-line.component.css']
})
export class ShippingLineComponent implements OnInit,OnDestroy{

    shippingLine: ShippingLine[] = [];

    shippingLineForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = true;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private ShippingLineService: ShippingLineService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService 
    ) {}

    ngOnInit(): void {
        this.shippingLineForm = new FormGroup({
            'ShippingLineID': new FormControl(0),
            'ShippingLine': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        });

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.ShippingLineService.getShippingLineData().subscribe(
                (response) => {
                    this.shippingLine = response;
                    this.isLoading = false;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Shipping Line';
        this.clearItems();
    }

    clearItems() {
        // this.shippingLineForm.setValue({
        //     ShippingLineID: 0,
        //     ShippingLine: null,
        //     ContactPerson: null,
        //     ContactNumber: null,
        //     UserID: 0
        // });
        this.shippingLineForm.reset();
        this.shippingLineForm.patchValue({ShippingLineID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;

        authObs = this.ShippingLineService.saveData(
            this.shippingLineForm.value.ShippingLineID, 
            this.shippingLineForm.value.ShippingLine, 
            this.shippingLineForm.value.ContactPerson, 
            this.shippingLineForm.value.ContactNumber, 
            this.shippingLineForm.value.UserID
        );

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.shippingLineForm.value.ShippingLine +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, life: 3000 
            });
        })
    }

    onSelect(data:any) {
        this.showDialog();
        this.dialogHeader = 'Edit Shipping Line';

        this.shippingLineForm.setValue({
            ShippingLineID: data.ShippingLineID,
            ShippingLine: data.ShippingLine,
            ContactPerson: data.ContactPerson,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        });
    }

    onDelete(id: any) {
        this.ShippingLineService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                this.getData();
               }
               
           }
        )
    }

    confirm2(event: Event, id: any) {
        this.ConfirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            accept: () => {
                this.onDelete(id);
            },
            reject: () => {
                // this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }

    // ==== INPUT SEARCH DATA====
    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }

}

interface ShippingLine {
}

interface ResponseData{
}