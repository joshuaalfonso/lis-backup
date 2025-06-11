import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, take } from "rxjs";
import { BankService } from "./bank.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Message, MessageService } from "primeng/api";
import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../users/users.service";
import { SystemLogsService } from "../system-logs/system-logs.service";


@Component({
    selector: 'app-bank',
    templateUrl: 'bank.component.html',  
    styleUrls: ['bank.component.css'] 
})
export class BankComponent implements OnInit, OnDestroy{

    bank: any[] = [];
    bankError: Message[] = [];
    isLoading: boolean = false;

    bankForm!: FormGroup;

    visible: boolean = false; 

    dialogHeader: string = '';

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private BankService: BankService,
        private MessageService: MessageService,
        private AuthService: AuthService,
        private UsersService: UsersService,
        private SystemLogsService: SystemLogsService
    ) {}

    ngOnInit(): void {
        this.bankForm = new FormGroup({
            'BankID': new FormControl(0),
            'Bank': new FormControl(null, Validators.required),
            'BankName': new FormControl(null, Validators.required),
            'UserID': new FormControl(0),
        })

        this.getUser();
        this.getAccess();
        this.getData();
        this.logBankView();
    }

    getUser() {
        this.subscription.add(
            this.AuthService.user.subscribe(user => {
                if (user) {
                    this.userID = user.user_id;
                }
            })
        )
    }

    getAccess() {
        this.subscription.add(
            this.UsersService.getUserAccess(this.userID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '4.5.1':
                                this.view = true;
                                break;
                            case '4.5.2':
                                this.insert = true;
                                break;
                            case '4.5.3':
                                this.edit = true;
                                break;
                            case '4.5.4':
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
            this.BankService.getData().subscribe(
                response => {
                    this.isLoading = false;
                    this.bank = response;
                },
                error => {
                    console.log(error);
                    this.isLoading = false;
                    this.bankError = [{ severity: 'error', detail: 'There was an error fetching data' }];
                }
            )
        )
    }

    logBankView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Bank'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.bankError = [{ severity: 'error', detail: 'Unkown error occured' }];
            }
        );

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
            this.userID
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