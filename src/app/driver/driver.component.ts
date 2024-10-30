import { Component, OnInit } from "@angular/core";
import { DriverService } from "./driver.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";


@Component({
    selector: 'app-driver',
    templateUrl: 'driver.component.html',
    styleUrls: ['driver.component.css']
})
export class DriverComponent implements OnInit{

    driver: Driver[] = [];

    driverForm!: FormGroup;

    visible: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    submitLoading: boolean = false;

    constructor(
        private DriverService: DriverService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.driverForm= new FormGroup({
            'DriverID': new FormControl(0),
            'DriverName': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.DriverService.getDriverData().subscribe(
            (response) => {
                this.driver = response;
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.visible = true;
        this.clearItems();
        this.dialogHeader = 'Add Driver';
    }

    clearItems() {
        this.driverForm.reset();
        this.driverForm.patchValue({DriverID: 0})
    }

    onSubmit() {

        if(!this.driverForm.valid) {
            alert('please fill all the blanks');
            return
        }

        this.submitLoading = true; 

        let authObs: Observable<ResponseData>;
        authObs = this.DriverService.saveData
        (
            this.driverForm.value.DriverID,
            this.driverForm.value.DriverName,
            this.driverForm.value.ContactNumber,
            this.driverForm.value.UserID,
        )

        authObs.subscribe(response =>{
            this.submitLoading = false; 


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
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.driverForm.value.DriverName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Driver';

        this.driverForm.setValue({
            DriverID: data.DriverID,
            DriverName: data.DriverName,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.DriverService.onDeleteData(id).subscribe(
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

}

interface Driver {
}
interface ResponseData {
}