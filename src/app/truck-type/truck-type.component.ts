import { Component, OnDestroy, OnInit } from "@angular/core";
import { TruckTypeService } from "./truck-type.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";


@Component({
    selector: 'app-truck-type',
    templateUrl: 'truck-type.component.html',
    styleUrls: ['truck-type.component.css']
})
export class TruckTypeComponent implements OnInit, OnDestroy{

    truckType: TruckType[] = [];

    truckTypeForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private TruckTypeService: TruckTypeService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.truckTypeForm = new FormGroup({
            'TruckTypeID': new FormControl(0),
            'TruckType': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.TruckTypeService.getTruckTypeData().subscribe(
                (response) => {
                    this.truckType = response;
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
        this.dialogHeader = 'Add Truck type';
        this.clearForm();
        
    }

    clearForm() {
        this.truckTypeForm.reset();
        this.truckTypeForm.patchValue({TruckTypeID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.TruckTypeService.saveData
        (
            this.truckTypeForm.value.TruckTypeID,
            this.truckTypeForm.value.TruckType,
            this.truckTypeForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.truckTypeForm.value.TruckType +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.truckTypeForm.value.TruckType +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.truckTypeForm.value.TruckType +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Truck type';

        this.truckTypeForm.setValue({
            TruckTypeID: data.TruckTypeID,
            TruckType: data.TruckType,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.TruckTypeService.onDeleteData(id).subscribe(
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

interface TruckType {
}

interface ResponseData {
}