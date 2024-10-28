import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { BankService } from "./bank.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";



@Component({
    selector: 'app-bank',
    templateUrl: 'bank.component.html', 
    styleUrls: ['bank.component.css'] 
})
export class BankComponent implements OnInit, OnDestroy{

    bank: any[] = [];

    bankForm!: FormGroup;

    visible: boolean = false;

    dialogHeader: string = '';

    private subscription: Subscription = new Subscription();

    constructor(
        private BankService: BankService,
        private MessageService: MessageService
    ) {}

    getData() {
        this.subscription.add(
            this.BankService.getData().subscribe(
                response => {
                    this.bank = response;
                }
            )
        )
    }

    ngOnInit(): void {
        this.bankForm = new FormGroup({
            'BankID': new FormControl(0),
            'Bank': new FormControl(null, Validators.required),
            'BankName': new FormControl(null, Validators.required),
            'UserID': new FormControl(0),
        })


        this.getData()
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }    

    showDialog() {
        this.dialogHeader = 'Add Bank';
        this.visible = true;
    }

    clearForm() {
        this.bankForm.reset();
        this.bankForm.patchValue({bankID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.BankService.saveData
        (
            this.bankForm.value.BankID, 
            this.bankForm.value.Bank, 
            this.bankForm.value.BankName, 
            this.bankForm.value.UserID, 
        );

        authObs.subscribe(response =>{

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
                    detail: 'Item: ' + this.bankForm.value.ChecherName +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        });
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Bank';
        this.bankForm.setValue({
            BankID: data.BankID,
            Bank: data.Bank,
            BankName: data.BankName,
            UserID: null
        })
    }

}

interface ResponseData {

}