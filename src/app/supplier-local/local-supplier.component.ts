import { Component, OnDestroy, OnInit } from '@angular/core'
import { SupplierService } from '../supplier/supplier.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService } from './country.service';
import currencySymbolMap from 'currency-symbol-map';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';



@Component({
    selector: 'app-local-supplier',
    templateUrl: 'local-supplier.component.html',
    styleUrls: ['local-supplier.component.css']
})

export class LocalSupplier implements OnInit, OnDestroy {

    
    localSupplier: any[] = [];
    isLoading: boolean = false;
    visible: boolean = false;
    submitLoading: boolean = false;
    dialogHeader: string = '';

    country: any[] = [];

    selectedLocal:any[]=[];

    localSupplierForm!: FormGroup;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;
    
    userID!: string;
    subscriptions: Subscription = new Subscription;
 
    constructor(
        private SupplierService: SupplierService,
        private CountryService: CountryService,
        private MessageService: MessageService,
        private AuthService: AuthService,
        private UsersService: UsersService
    ) {}


    ngOnInit(): void {
        
        this.getLocalSupplier();
        this.getCountry();
        this.newForm();
        // console.log(currencySymbolMap('USD'));
        this.getUser();
        this.getAccess();       

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
    

    newForm() {

        this.localSupplierForm = new FormGroup({
            'SupplierID': new FormControl(0),
            'Supplier': new FormControl(null, Validators.required),
            'Source': new FormControl(null),
            'Product': new FormControl(null),
            'Address': new FormControl(null, Validators.required),
            'Currency': new FormControl(null, Validators.required),
            'Origin': new FormControl(null , Validators.required),
            'Indentor': new FormControl(null),
            'IndentorAddress': new FormControl(null),
            'Terms': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null),
            'ContactNumber': new FormControl(null),
            'UserID': new FormControl(null),
        })

    }

    getUser() {
        this.AuthService.user.subscribe(
            user => {
                if (user) {
                    this.userID = user.user_id;
                }
            }, error => {
                console.error(error);
            }
        )
    }

    getAccess() {
        this.subscriptions.add(
            this.UsersService.getUserAccess(this.userID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.15.1':
                                this.view = true;
                                break;
                            case '2.15.2':
                                this.insert = true;
                                break;
                            case '2.15.3':
                                this.edit = true;
                                break;
                            case '2.15.4':
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

    getLocalSupplier() {
        this.isLoading = false;

        this.subscriptions.add(
            this.SupplierService.getLocalSupplier().subscribe(
                response => {
                    this.localSupplier = response;
                }, error => {
                    console.log(error);
                    
                }
            )
        )

    }

    showDialog() {
        this.formReset();
        this.visible = true;
        this.dialogHeader = 'Create Supplier';
        this.selectedLocal = [];

        for (let i=0; i<= this.country.length-1; i++) {
            if (this.country[i].code=='PHP') {
                this.selectedLocal = this.country[i];  
                this.localSupplierForm.patchValue(
                    {Origin: this.selectedLocal}
                );
            }
        }

    }

    formReset() {
        this.localSupplierForm.reset();
        this.localSupplierForm.patchValue({SupplierID: 0});
    }

    onSubmit() {

        const source = 1;
        
        const createLocalSupplierSub = this.SupplierService.saveData(
            this.localSupplierForm.value.SupplierID,
            this.localSupplierForm.value.Supplier,
            this.localSupplierForm.value.Address,
            this.localSupplierForm.value.ContactPerson,
            this.localSupplierForm.value.ContactNumber,
            source,
            this.localSupplierForm.value.Product,
            this.localSupplierForm.value.Currency,
            this.localSupplierForm.value.Origin?.country || null,
            this.localSupplierForm.value.Indentor,
            this.localSupplierForm.value.IndentorAddress,
            this.localSupplierForm.value.Terms,
            this.userID,
        ).subscribe(response => {
            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
                this.getLocalSupplier();
                this.formReset();
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated', 
                    life: 3000 
                });
                this.visible = false;
                this.getLocalSupplier();
                this.formReset();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.localSupplierForm.value.Supplier +  ' already exist', 
                    life: 3000 
                });
            }
        }, errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage || 'Unkown error occured', 
                life: 3000 
            });
        })

        this.subscriptions.add(createLocalSupplierSub);

    }

    onSelect(row: any) {

        this.visible = true;
        this.dialogHeader = 'Edit Supplier';

        const origin = this.findObjectByID(row.Origin)

        this.localSupplierForm.setValue({
            SupplierID: row.SupplierID,
            Supplier: row.Supplier,
            Address: row.Address,
            ContactPerson: row.ContactPerson,
            ContactNumber: row.ContactNumber,
            Source: row.Source,
            Product: row.Product,
            Currency: row.Currency,
            Origin: origin,
            Indentor: row.Indentor,
            IndentorAddress: row.IndentorAddress,
            Terms: row.Terms,
            UserID: this.userID
        })

    }

    findObjectByID(countrName: string) {

         for(let i = 0; i < this.country.length; i++) {

            if (this.country[i].country == countrName) {
                return this.country[i];
            }

        }

        return null;
    }

    getCountry() {

        this.country = this.CountryService.countryList();
        // console.log(this.country);
    }

    onSelectCountry(event: any) {

        if (event == null) {
            console.log('No currency code');
            this.localSupplierForm.patchValue({Currency: null})
            return
        }

        const currency = currencySymbolMap(event.code);

        this.localSupplierForm.patchValue({Currency: currency})
           
    }

    getFlag(coutryName: string) {

        for(let i = 0; i < this.country.length; i++) {

            if (this.country[i].country == coutryName) {
                return this.country[i].countryCode
            }

        }

        return null;

    }

}