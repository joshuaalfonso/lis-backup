import { Component, OnDestroy, OnInit } from "@angular/core";
import { TruckingService } from "./trucking.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";



@Component({
    selector: 'app-trucking',
    templateUrl: 'trucking.component.html',
    styleUrls: ['trucking.component.css']
})
export class TruckingComponent implements OnInit, OnDestroy{

    trucking: any[] = [];

    truckingForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private TruckingService: TruckingService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.truckingForm = new FormGroup({
            'TruckingID': new FormControl(0),
            'TruckingName': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null),
            'ContactNumber': new FormControl(null),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.TruckingService.getTruckingData().subscribe(
                response => {
                    this.trucking = response;
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
        this.dialogHeader = 'Add Trucking';
        this.clearForms();
    }

    clearForms() {
        this.truckingForm.reset();
        this.truckingForm.patchValue({TruckingID: 0})
    }

    onSubmit() {

        let authObs: Observable<ResponseData>;
        authObs = this.TruckingService.saveData
        (
            this.truckingForm.value.TruckingID,
            this.truckingForm.value.TruckingName,
            this.truckingForm.value.ContactPerson,
            this.truckingForm.value.ContactNumber,
            this.truckingForm.value.UserID,
        )

        authObs.subscribe(response => {

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.truckingForm.value.TruckingName +  ' successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearForms();
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.truckingForm.value.TruckingName +  ' successfully updated', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearForms();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.truckingForm.value.TruckingName +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })

    }

    onSelect(data: any) {

        this.showDialog();
        this.dialogHeader = 'Edit Trucking';

        this.truckingForm.setValue({
            TruckingID: data.TruckingID,
            TruckingName: data.TruckingName,
            ContactPerson: data.ContactPerson,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        })

    }

    onDelete(id: any) {
        this.TruckingService.onDeleteData(id).subscribe(
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

interface ResponseData {

}