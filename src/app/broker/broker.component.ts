import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormControl, Validators } from "@angular/forms";
import { BrokerService } from "./broker.service";
import { Observable, Subscription, take } from "rxjs";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";
import { SystemLogsService } from "../system-logs/system-logs.service";


@Component({
    selector: 'app-broker',
    templateUrl: 'broker.component.html',
    styleUrls: ['broker.component.css']
})

export class BrokerComponent implements OnInit, OnDestroy{

    value: string | undefined;

    broker: Broker[] = [];
    brokerError: Message[] = [];

    brokerForm!: FormGroup;

    visible: boolean = false;

    dialogHeader!: string;

    isLoading: boolean = false;

    subscription: Subscription = new Subscription;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    constructor( 
        private BrokerService: BrokerService, 
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private AuthService: AuthService,
        private UsersService: UsersService,
        private SystemLogsService: SystemLogsService
    ){}

    ngOnInit(): void {
        this.brokerForm = new FormGroup({
            'BrokerID': new FormControl(0),
            'Broker': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'UserID': new FormControl(0),
        });

        this.getUser();
        this.getAccess();
        this.getData();
        this.logBrokerView();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // ==== GET BROKER DATA ====
    getData() {
        this.isLoading = true;
        
        this.subscription.add(
            this.BrokerService.getBrokerData().subscribe(
                response => {
                    this.broker = response;
                    this.isLoading = false;
                },
                error => {
                    this.isLoading = false;
                    console.log(error);
                    this.brokerError = [{ severity: 'error', detail: 'There was an error fetching data' }];
                }
            )
        )
    }

    logBrokerView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Broker'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.brokerError = [{ severity: 'error', detail: 'Unkown error occured' }];
            }
        );

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
                            case '4.6.1':
                                this.view = true;
                                break;
                            case '4.6.2':
                                this.insert = true;
                                break;
                            case '4.6.3':
                                this.edit = true;
                                break;
                            case '4.6.4':
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
        this.dialogHeader = 'Add Broker';
        this.clearForm();
    }

    clearForm() {
        this.brokerForm.reset();
        this.brokerForm.patchValue({BrokerID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.BrokerService.saveData(
            this.brokerForm.value.BrokerID, 
            this.brokerForm.value.Broker, 
            this.brokerForm.value.ContactPerson, 
            this.brokerForm.value.ContactNumber, 
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
                    detail: 'Item: ' + this.brokerForm.value.Broker +  ' already exist', 
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
        })

    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Broker';

        this.brokerForm.setValue({
            BrokerID: data.BrokerID,
            Broker: data.Broker,
            ContactPerson: data.ContactPerson,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        })

    }

    onDelete(id: any) {
        this.BrokerService.onDeleteData(id).subscribe(
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

interface Broker {

}

interface ResponseData {

}