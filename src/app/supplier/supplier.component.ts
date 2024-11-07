import { Component, OnDestroy, OnInit } from "@angular/core";
import { SupplierService } from "./supplier.service";
import { FormControl, FormGroup, Validators, FormGroupDirective } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { ConfirmationService } from "primeng/api";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit, OnDestroy{

    supplierForm!: FormGroup;

    supplier: Supplier[]= [];

    visible: boolean= false;

    isLoading: boolean = false;

    submitLoading: boolean = false;

    dialogHeader?: string;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor( 
        private SupplierService: SupplierService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private UsersService: UsersService,
        private AuthService: AuthService
    ){}

    ngOnInit(): void {
        
        this.supplierForm = new FormGroup({
            'SupplierID': new FormControl(0),
            'Supplier': new FormControl(null, Validators.required),
            'Address': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'UserID' : new FormControl(0)
        })

        // ==== DISPLAY DATA ====
        this.getUser();
        this.getAccess();
        this.getSupplier();
    }

    // ==== GET SUPPLIER DATA ====
    getSupplier() {
        this.isLoading = true;
        this.subscription.add(
            this.SupplierService.getSupplierData().subscribe( 
                response => {
                    this.supplier = response;
                    this.isLoading = false;
                }
            )
        )
    }

    // ==== UNSUBSCRIBE ====
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getUser() {
        this.AuthService.user.subscribe(
            user => {
                if (user) {
                    this.userID = user.user_id;
                }
            }
        )
    }

    getAccess() {
        this.subscription.add(
            this.UsersService.getUserAccess(this.userID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.14.1':
                                this.view = true;
                                break;
                            case '2.14.2':
                                this.insert = true;
                                break;
                            case '2.14.3':
                                this.edit = true;
                                break;
                            case '2.14.4':
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

    // ==== SHOW MODAL ====
    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Supplier';
        this.clearItems();
    }

    // ==== RESET FORM ====
    clearItems(){
        this.supplierForm.reset();
        this.supplierForm.patchValue({SupplierID: 0})
    }

    // ==== SUBMIT FORM DATA ====
    onSubmit() {

        if(!this.supplierForm.valid) {
            alert('please fill all the blanks');
            return
        } 

        this.submitLoading = true;

        let authObs: Observable<ResponseData>;
        authObs = this.SupplierService.saveData(
            this.supplierForm.value.SupplierID, 
            this.supplierForm.value.Supplier, 
            this.supplierForm.value.Address, 
            this.supplierForm.value.ContactPerson, 
            this.supplierForm.value.ContactNumber, 
            this.userID
        );

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
                this.getSupplier();
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
                this.getSupplier();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.supplierForm.value.Supplier +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        })
        
    }

    // ==== EDIT ITEM ====
    onSelect(data: any) {
        this.visible = true;
        this.dialogHeader = 'Edit Supplier';

        this.supplierForm.setValue({
            SupplierID: data.SupplierID,
            Supplier: data.Supplier,
            Address: data.Address,
            ContactPerson: data.ContactPerson,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        })
    }

    // ==== INPUT SEARCH DATA====
    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }

    // ==== DELETE ITEM ====
    onDelete(id:any) {
        this.SupplierService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                this.getSupplier();
               }
               
           }
         )
    }

    // ==== DELETE CONFIRMATION ====
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

interface Supplier {
}
interface ResponseData{
}