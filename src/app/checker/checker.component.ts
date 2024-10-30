import { Component, OnDestroy, OnInit } from "@angular/core";
import { CheckerService } from "./checker.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { CheckerTypeService } from "../checker-type/checker-type.service";


@Component({
    selector: 'app-checker',
    templateUrl: 'checker.component.html',
    styleUrls: ['checker.component.css']
})
export class CheckerComponent implements OnInit,OnDestroy{

    checker: Checker[] = [];

    checkerType: any[] = [];

    checkerForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private CheckerService: CheckerService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private CheckerTypeService: CheckerTypeService
    ){}

    ngOnInit(): void {

        this.checkerForm = new FormGroup({
            'CheckerID': new FormControl(0),
            'CheckerName': new FormControl(null, Validators.required),
            // 'CheckerTypeID': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
        this.getCheckerType();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.CheckerService.getCheckerData().subscribe(
                (response) => {
                    this.checker = response;
                    this.isLoading = false;
                }
            )
        )
    }

    getCheckerType() {
        this.subscription.add(
            this.CheckerTypeService.getCheckerTypeData().subscribe(
                response => {
                    this.checkerType = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }    

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Checker';
        this.clearForm();
    }

    clearForm() {
        this.checkerForm.reset();
        this.checkerForm.patchValue({CheckerID: 0, UserID: 0})
    }

    onSubmit() {
        // console.log(this.checkerForm.value.CheckerTypeID.CheckerTypeID)
        let authObs: Observable<ResponseData>;
        authObs = this.CheckerService.saveData
        (
            this.checkerForm.value.CheckerID, 
            this.checkerForm.value.CheckerName, 
            // this.checkerForm.value.CheckerTypeID.CheckerTypeID, 
            this.checkerForm.value.UserID
        );

        authObs.subscribe(response =>{

            if( response === 1) {
                this.visible = false;
                this.MessageService.add({ detail: 'Successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.visible = false;
                this.MessageService.add({ detail: 'Successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.checkerForm.value.ChecherName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
   
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Checker';

        let chckerTypeValue = {};

        for (let i = 0; i <= this.checkerType.length -1; i++) {
            if (data.CheckerTypeID == this.checkerType[i].CheckerTypeID) {
                chckerTypeValue = this.checkerType[i]
                break;
            }
        }

        this.checkerForm.setValue({
            CheckerID: data.CheckerID,
            CheckerName: data.CheckerName,
            CheckerTypeID: chckerTypeValue,
            UserID: data.UserID
        });
    }

    onDelete(id: any) {
        this.CheckerService.onDeleteData(id).subscribe(
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

interface Checker {
}
interface ResponseData{
}

