import { Component, OnDestroy, OnInit } from "@angular/core";
import { ShippingDocumentService } from "./shipping-document.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { MessageService } from "primeng/api";




@Component({
    selector: 'app-shipping-document',
    templateUrl: 'shipping-document.component.html',
    styleUrls: ['shipping-document.component.css']
})
export class ShippingDocumentComponent implements OnInit, OnDestroy{

    shippingDocument: any[] = [];
    shippingDocumentForm!: FormGroup;
    dialogHeader?: string;
    visible: boolean = false;
    isLoading: boolean = false;
    private subscription: Subscription = new Subscription();
    constructor(
        private ShippingDocumentService: ShippingDocumentService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {
        this.shippingDocumentForm = new FormGroup({
            'ShippingDocumentID': new FormControl(0),
            'ShippingDocument': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.ShippingDocumentService.getShippingDocumentData().subscribe(
                response => {
                    this.shippingDocument = response;
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
        this.dialogHeader = 'Add Shipping Document';
    }

    clearItems() {
        this.shippingDocumentForm.reset();
        this.shippingDocumentForm.patchValue({ShippingDocumentID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.ShippingDocumentService.saveData
        (
            this.shippingDocumentForm.value.ShippingDocumentID,
            this.shippingDocumentForm.value.ShippingDocument,
            this.shippingDocumentForm.value.UserID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.shippingDocumentForm.value.ShippingDocument +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.shippingDocumentForm.value.ShippingDocument +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.shippingDocumentForm.value.ShippingDocument +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();

        this.shippingDocumentForm.setValue({
            ShippingDocumentID: data.ShippingDocumentID,
            ShippingDocument: data.ShippingDocument,
            UserID: data.UserID
        })
    }

}

interface ResponseData {

}