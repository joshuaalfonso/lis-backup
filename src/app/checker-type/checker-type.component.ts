import { Component, OnInit } from "@angular/core";
import { CheckerTypeService } from "./checker-type.service";
import { Observable, Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";



@Component({
    selector: 'app-checker-type',
    templateUrl: 'checker-type.component.html',
    styleUrls: ['checker-type.component.css']
})
export class CheckerType implements OnInit{

    checkerType: any[] = [];

    checkerTypeForm!: FormGroup;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    visible: boolean = false;

    isLoading?: boolean;

    constructor(
        private CheckerTypeService: CheckerTypeService,
        private MessageService: MessageService
    ) {}


    ngOnInit(): void {
        this.checkerTypeForm = new FormGroup({
            'CheckerTypeID': new FormControl(0),
            'CheckerType': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData(); 
    }

    getData() {
        this.isLoading = true;
        this.CheckerTypeService.getCheckerTypeData().subscribe(
            response => {
                this.checkerType = response
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.clearItems();
        this.dialogHeader = 'Add Checker Type'
        this.visible = true;
    }

    clearItems() {
        this.checkerTypeForm.reset();
        this.checkerTypeForm.patchValue({
            CheckerTypeID: 0,
            UserID: 0
        })
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.CheckerTypeService.saveData
        (
            this.checkerTypeForm.value.CheckerTypeID,
            this.checkerTypeForm.value.CheckerType,
            this.checkerTypeForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.visible = false;
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.checkerTypeForm.value.CheckerType +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.visible = false;
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.checkerTypeForm.value.CheckerType +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.checkerTypeForm.value.CheckerType +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
    }

    onSelect(data: any) {
        this.showDialog();
        this.checkerTypeForm.setValue({
            CheckerTypeID: data.CheckerTypeID,
            CheckerType: data.CheckerType,
            UserID: data.UserID
        })
    }

}


interface ResponseData {

}