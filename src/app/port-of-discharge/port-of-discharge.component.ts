import { Component, OnDestroy, OnInit } from "@angular/core";
import { PortOfDischargeService } from "./port-of-discharge.service";
import { Observable, Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";




@Component({
    selector: 'app-port-of-discharge',
    templateUrl: 'port-of-discharge.component.html',
    styleUrls: ['port-of-discharge.component.css']
})
export class PortOfDischarge implements OnInit, OnDestroy{

    private subscription: Subscription = new Subscription;

    portOfDischarge: any[] = [];

    portOfDischargeForm!: FormGroup;

    isLoading: boolean = false;

    visible: boolean = false;

    dialogHeader?: string;


    constructor(
        private PortOfDischargeService: PortOfDischargeService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {

        this.portOfDischargeForm = new FormGroup({
            'PortOfDischargeID': new FormControl(0),
            'PortOfDischarge': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }    

    getData() {
        this.isLoading = true;
        this.PortOfDischargeService.getData().subscribe(
            response => {
                this.portOfDischarge = response;
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.clearForm();
        this.visible = true;
        this.dialogHeader = 'Add Port Of Discharge';
    }

    clearForm() {
        this.portOfDischargeForm.reset();
        this.portOfDischargeForm.patchValue({PortOfDischargeID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.PortOfDischargeService.saveData
        (
            this.portOfDischargeForm.value.PortOfDischargeID,
            this.portOfDischargeForm.value.PortOfDischarge,
            this.portOfDischargeForm.value.UserID,
        )

        authObs.subscribe(response => {

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearForm();
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
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.portOfDischargeForm.value.PortOfDischarge +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Port of Discharge'
        this.portOfDischargeForm.setValue({
            PortOfDischargeID: data.PortOfDischargeID,
            PortOfDischarge: data.PortOfDischarge,
            UserID: data.UserID,
        })
    }

}

interface ResponseData {

}