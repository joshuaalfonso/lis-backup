import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomerService } from "./customer.service";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { SalesAgentService } from "../sales-agent/sales-agent.service";



@Component({
    selector: 'app-customer',
    templateUrl: 'customer.component.html',
    styleUrls: ['customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy{

    customer: any[] = [];

    salesAgent: any[] = [];

    customerForm!: FormGroup;
    
    visible: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private CustomerService: CustomerService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private SalesAgentService: SalesAgentService
    ) {}

    ngOnInit(): void {
        this.customerForm = new FormGroup({
            'CustomerID': new FormControl(0),
            'SalesAgentID': new FormControl(null, Validators.required),
            'CustomerName': new FormControl(null, Validators.required),
            'Address': new FormControl(null, Validators.required),
            'ContactNo': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.CustomerService.getCustomerData().subscribe(
                response => {
                    this.customer = response;
                    this.isLoading = false;
                }
            )
        )

        this.subscription.add(
            this.SalesAgentService.getSalesAgentData().subscribe(
                response => {
                    this.salesAgent = response;
                    // console.log(response)
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.clearForm();
        this.dialogHeader = 'Add Customer';
    }

    clearForm() {
        this.customerForm.reset();
        this.customerForm.patchValue({CustomerID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>
        authObs = this.CustomerService.saveData
        (
            this.customerForm.value.CustomerID,
            this.customerForm.value.SalesAgentID.SalesAgentID,
            this.customerForm.value.CustomerName,
            this.customerForm.value.Address,
            this.customerForm.value.ContactNo,
            this.customerForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.customerForm.value.CustomerName +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.customerForm.value.CustomerName +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.customerForm.value.CustomerName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Customer';

        let salesAgentValue = {};

        for (let i = 0; i <= this.salesAgent.length -1; i++) {
            if (this.salesAgent[i].SalesAgentID === data.SalesAgentID) {
                salesAgentValue = this.salesAgent[i];
                break;
            }
        }

        this.customerForm.setValue({
            CustomerID: data.CustomerID,
            SalesAgentID: salesAgentValue,
            CustomerName: data.CustomerName,
            Address: data.Address,
            ContactNo: data.ContactNo,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.CustomerService.onDeleteData(id).subscribe(
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