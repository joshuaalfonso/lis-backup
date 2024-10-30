import { Component, OnDestroy, OnInit } from "@angular/core";
import { TruckService } from "./truck.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AuthService } from "../auth/auth.service";



@Component({
    selector: 'app-truck',
    templateUrl: 'truck.component.html',
    styleUrls: ['truck.component.css']
})
export class TruckComponent implements OnInit, OnDestroy{

    truck: any[] = [];

    truckType: any[] = [];

    trucking: any[] = [];

    truckForm!:  FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    userID: string = '';

    submitLoading: boolean = false;

    subscription: Subscription = new Subscription;

    constructor(
        private TruckService: TruckService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private Auth: AuthService
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

        

        this.getUser();
        this.getData();
        this.getTruckType();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getUser() {
        this.subscription.add(
            this.Auth.user.subscribe(
                user => {
                    if (user) {
                        this.userID = user.user_id;
                    }
                }
            )
        )
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
    }

    getTruckType() {
        this.subscription.add(
            this.TruckService.GetTruckTypeData().subscribe(
                response => {
                    this.truckType = response;
                }
            )
        )
    }

    getTrucking() {
        this.subscription.add(
            this.TruckService.GetTruckingData().subscribe(
                response => {
                    this.trucking = response;
                    // console.log(response)
                }
            )
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

        if (!this.truckForm.valid) {
            alert('please fill all the blanks')
            return 
        }

        this.submitLoading = true;


        let authObs: Observable<ResponseData>;
        authObs = this.TruckService.saveData
        (
            this.truckForm.value.TruckID,
            this.truckForm.value.TruckingID,
            // this.truckForm.value.TruckTypeID,
            this.truckForm.value.PlateNo,
            this.truckForm.value.Description,
            this.userID,
        )

        authObs.subscribe(response =>{

            this.submitLoading = false;

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Danger', 
                    detail: this.truckForm.value.PlateNo +  ' successfully recorded', 
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
                    detail: this.truckForm.value.PlateNo +  ' successfully updated', 
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

            this.submitLoading = false;
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
            // TruckTypeID: data.TruckTypeID,
            PlateNo: data.PlateNo,
            Description: data.Description,
            UserID: this.userID
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