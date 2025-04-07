import { Component, OnDestroy, OnInit } from "@angular/core";
import { SupplierService } from "./supplier.service";
import { FormControl, FormGroup, Validators, FormGroupDirective } from "@angular/forms";
import { Observable, Subscription, take } from "rxjs";
import { Message, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { ConfirmationService } from "primeng/api";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";
import { CountryService } from "../supplier-local/country.service";
import currencySymbolMap from 'currency-symbol-map';
import { SystemLogsService } from "../system-logs/system-logs.service";

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit, OnDestroy{

    supplierForm!: FormGroup;

    supplier: Supplier[]= [];
    supplierError: Message[] = []
;
    visible: boolean= false;

    isLoading: boolean = false;

    submitLoading: boolean = false;

    dialogHeader?: string;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    countries: any[] = [];

    private subscription: Subscription = new Subscription();

    constructor( 
        private SupplierService: SupplierService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private UsersService: UsersService,
        private CountryService: CountryService,
        private AuthService: AuthService,
        private SystemLogsService: SystemLogsService
    ){}

    ngOnInit(): void {
        
        this.supplierForm = new FormGroup({
            'SupplierID': new FormControl(0),
            'Supplier': new FormControl(null, Validators.required),
            'Address': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'Source': new FormControl(null),
            'Product': new FormControl(null),
            'Currency': new FormControl(null),
            'Origin': new FormControl(null),
            'Indentor': new FormControl(null),
            'IndentorAddress': new FormControl(null),
            'Terms': new FormControl(null),
            'UserID': new FormControl(null),
        })

        // 'SupplierID': new FormControl(0),
        // 'Supplier': new FormControl(null, Validators.required),
        // 'Address': new FormControl(null, Validators.required),
        // 'ContactPerson': new FormControl(null, Validators.required),
        // 'ContactNumber': new FormControl(null, Validators.required),
        // 'Source': new FormControl(null),
        // 'Product': new FormControl(null),
        // 'UserID' : new FormControl(0)

        // ==== DISPLAY DATA ====
        this.getUser();
        this.getAccess();
        this.getSupplier();
        this.getCountry();
        this.logImportSupplierView();
    }

    // ==== GET SUPPLIER DATA ====
    getSupplier() {
        this.isLoading = true;
        this.subscription.add(
            this.SupplierService.getSupplierData().subscribe( 
                response => {
                    this.supplier = response;
                    this.isLoading = false;
                },
                error => {
                    console.log(error);
                    this.isLoading = false;
                    this.supplierError = [{ severity: 'error', detail: 'There was an error fetching data' }]
                }
            )
        )
    }

    logImportSupplierView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Import Supplier'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.supplierError = [{ severity: 'error', detail: 'Unkown error occured' }]
            }
        );

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

    getCountry() {

        this.countries = this.CountryService.countryList();
        // console.log(this.countries);
    }

    onSelectCountry(event: any) {

        if (event == null) {
            console.log('No currency code');
            this.supplierForm.patchValue({Currency: null})
            return
        }

        const currency = currencySymbolMap(event.code);

        this.supplierForm.patchValue({Currency: currency})
           
    }

    findObjectByID(countrName: string) {
        
        for(let i = 0; i < this.countries.length; i++) {

           if (this.countries[i].country == countrName) {
               return this.countries[i];
           }

       }

       return countrName;
    }

    getFlag(coutryName: string) {

        for(let i = 0; i < this.countries.length; i++) {

            if (this.countries[i].country == coutryName) {
                return this.countries[i].countryCode
            }

        }

        return null;

    }

    // ==== SUBMIT FORM DATA ====
    onSubmit() {

        if(!this.supplierForm.valid) {
            alert('please fill all the blanks');
            return
        }  

        const importationSourceValue = 2;

        this.submitLoading = true;    

        let authObs: Observable<ResponseData>;
        authObs = this.SupplierService.saveData(
            this.supplierForm.value.SupplierID, 
            this.supplierForm.value.Supplier, 
            this.supplierForm.value.Address, 
            this.supplierForm.value.ContactPerson, 
            this.supplierForm.value.ContactNumber, 
            importationSourceValue, 
            this.supplierForm.value.Product, 
            this.supplierForm.value.Currency, 
            this.supplierForm.value.Origin?.country || null, 
            this.supplierForm.value.Indentor, 
            this.supplierForm.value.IndentorAddress, 
            this.supplierForm.value.Terms, 
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

        const origin = this.findObjectByID(data.Origin);

        this.supplierForm.setValue({
            SupplierID: data.SupplierID,
            Supplier: data.Supplier,
            Address: data.Address,
            ContactPerson: data.ContactPerson,
            ContactNumber: data.ContactNumber,
            Source: data.Source,
            Product: data.Product,
            Currency: data.Currency,
            Origin: origin,
            Indentor: data.Indentor,
            IndentorAddress: data.IndentorAddress,
            Terms: data.Terms,
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