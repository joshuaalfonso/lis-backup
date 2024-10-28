import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SalesAgentService } from "./sales-agent.service";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";




@Component({
    selector: 'app-sales-agent',
    templateUrl: 'sales-agent.component.html',
    styleUrls: ['sales-agent.component.css']
})
export class SalesAgentComponent implements OnInit{

    salesAgent: any[] = [];

    salesAgentForm!: FormGroup;

    visible: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    constructor(
        private SalesAgentService: SalesAgentService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {
        this.salesAgentForm = new FormGroup({
            'SalesAgentID': new FormControl(0),
            'SalesAgent': new FormControl(null, Validators.required),
            'ContactNo': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })
        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.SalesAgentService.getSalesAgentData().subscribe(
            response => {
                this.salesAgent = response;
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Sales Agent';
        this.clearItems();
    }

    clearItems() {
        this.salesAgentForm.reset();
        this.salesAgentForm.patchValue({SalesAgentID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.SalesAgentService.saveData
        (
            this.salesAgentForm.value.SalesAgentID,
            this.salesAgentForm.value.SalesAgent,
            this.salesAgentForm.value.ContactNo,
            this.salesAgentForm.value.UserID
        )
        
        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.salesAgentForm.value.SalesAgent +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.salesAgentForm.value.SalesAgent +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.salesAgentForm.value.SalesAgent +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Sales Agent';

        this.salesAgentForm.setValue({
            SalesAgentID: data.SalesAgentID,
            SalesAgent: data.SalesAgent,
            ContactNo: data.ContactNo,
            UserID: data.UserID
        })
    }


}

interface ResponseData {

}