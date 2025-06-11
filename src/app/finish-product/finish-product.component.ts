import { Component, OnDestroy, OnInit } from "@angular/core";
import { FinishProductService } from "./finish-product.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { UsersService } from "../pages/users/users.service";
import { AuthService } from "../auth/auth.service";


@Component({
    selector: 'app-finish-product',
    templateUrl: 'finish-product.component.html',
    styleUrls: ['finish-product.component.css']
})
export class FinishProductComponent implements OnInit, OnDestroy{

    visible: boolean = false;

    finishProduct: any[] = [];

    finishProductForm!: FormGroup;

    isLoading: boolean = false;

    dialogHeader?: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private FinishProductService: FinishProductService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private auth: AuthService,
        private UsersService: UsersService
    ) {}

    ngOnInit(): void {
        this.finishProductForm = new FormGroup({
            'FinishProductID': new FormControl(0),
            'FinishProductCode': new FormControl(null, Validators.required),
            'FinishProduct': new FormControl(null, Validators.required),
            'KiloPerBag': new FormControl(null, Validators.required),
            'Quantity': new FormControl(0),
            'Weight': new FormControl(0),
            'UserID': new FormControl(0)
        })

        this.auth.user.subscribe(
            user => {
                if (user) {
                    this.getUserAccess(user!.user_id);
                }
            }
        )

        this.getData();
    }

    getUserAccess(UserID: string) {
        this.subscription.add(
             this.UsersService.getUserAccess(UserID).subscribe(
                 response => {
                     let userRights = response;
 
                     for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 2.1:
                                this.view = true;
                                break;
                            case 2.2:
                                this.insert = true;
                                break;
                            case 2.3:
                                this.edit = true;
                                break;
                            case 2.4:
                                this.generateReport = true;
                                break;
                            default:
                                break;
                        }
                    }

                 }
             )       
        )
    }
    

    getData() { 
        this.isLoading = true;
        this.subscription.add(
            this.FinishProductService.getFinishProductData().subscribe(
                response => {
                    this.finishProduct = response;
                    // console.log(response)
                    this.isLoading = false;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


    showDialog() {

        if (!this.insert) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'You are not authorized!', life: 3000 });
            return;
        }

        this.visible = true;
        this.dialogHeader = 'Add Finish Product';
        this.clearForm();
    }

    clearForm() {
        this.finishProductForm.reset();
        this.finishProductForm.patchValue({FinishProductID: 0, Quantity: 0, Weight: 0})
    }

    onSubmit() {
        if (!this.insert) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'You are not authorized!', life: 3000 });
            return;
        }

        let authObs: Observable<ResponseData>;
        authObs = this.FinishProductService.saveData
        (
            this.finishProductForm.value.FinishProductID,
            this.finishProductForm.value.FinishProductCode,
            this.finishProductForm.value.FinishProduct,
            this.finishProductForm.value.KiloPerBag,
            this.finishProductForm.value.Quantity,
            this.finishProductForm.value.Weight,
            this.finishProductForm.value.UserID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.visible = false;
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.finishProductForm.value.FinishProduct +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.visible = false;
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.finishProductForm.value.FinishProduct +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.finishProductForm.value.FinishProduct +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {

        if (!this.edit) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'You are not authorized!', life: 3000 });
            return;
        }

        this.showDialog();
        this.dialogHeader = 'Edit Finish Product';

        this.finishProductForm.setValue({
            FinishProductID: data.FinishProductID,
            FinishProductCode: data.FinishProductCode,
            FinishProduct: data.FinishProduct,
            KiloPerBag: data.KiloPerBag,
            Quantity: data.Quantity,
            Weight: data.Weight,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.FinishProductService.onDeleteData(id).subscribe(
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