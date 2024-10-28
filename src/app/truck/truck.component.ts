import { Component, OnInit } from "@angular/core";
import { TruckService } from "./truck.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";



@Component({
    selector: 'app-truck',
    templateUrl: 'truck.component.html',
    styleUrls: ['truck.component.css']
})
export class TruckComponent implements OnInit{

    truck: any[] = [];

    truckType: any[] = [];

    trucking: any[] = [];

    truckForm!:  FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    userID: string = '';

    constructor(
        private TruckService: TruckService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.truckForm = new FormGroup({
            'TruckID': new FormControl(null, Validators.required),
            'TruckingID': new FormControl(null, Validators.required),
            // 'TruckTypeID': new FormControl(null),
            'PlateNo': new FormControl(null, Validators.required),
            'Description': new FormControl(null),
            'UserID': new FormControl
        })

        this.getData()
    }

    getData() {
        this.isLoading = true;
        this.TruckService.GetTruckData().subscribe(
            response => {
                this.truck = response;
                this.isLoading = false;
                // console.log(response)
            }
        )

        this.TruckService.GetTruckTypeData().subscribe(
            response => {
                this.truckType = response;
                // console.log(response)
            }
        )

        this.TruckService.GetTruckingData().subscribe(
            response => {
                this.trucking = response;
                // console.log(response)
            }
        )
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Truck';
        this.clearForm();
    }

    clearForm() {
        this.truckForm.reset();
        this.truckForm.patchValue({TruckID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.TruckService.saveData
        (
            this.truckForm.value.TruckID,
            this.truckForm.value.TruckingID,
            // this.truckForm.value.TruckTypeID,
            this.truckForm.value.PlateNo,
            this.truckForm.value.Description,
            this.truckForm.value.UserID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.truckForm.value.TruckID +  ' successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.truckForm.value.TruckID +  ' successfully updated', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.truckForm.value.TruckID +  ' already exist', 
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
        this.dialogHeader = 'Edit Truck';

        // let truckTypeValue = {};

        // for(let i = 0; i < this.truckType.length -1; i++) {
        //     if(this.truckType[i].TruckTypeID == data.TruckTypeID) {
        //         truckTypeValue = this.truckType[i];
        //     }
        // }

        // let truckingValue = {};

        // for(let i = 0; i < this.trucking.length -1; i++) {
        //     if(this.trucking[i].TruckingID == data.TruckingID) {
        //         truckingValue = this.trucking[i];
        //     }
        // }


        this.truckForm.setValue({
            TruckID: data.TruckID,
            TruckingID: data.TruckingID,
            TruckTypeID: data.TruckTypeID,
            PlateNo: data.PlateNo,
            Description: data.Description,
            UserID: data.UserID
        })
        // console.log(data);
    }

    onDelete(id: any) {
        this.TruckService.onDeleteData(id).subscribe(
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

interface ResponseData{

}