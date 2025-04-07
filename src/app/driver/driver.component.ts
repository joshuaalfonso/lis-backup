import { Component, OnDestroy, OnInit } from "@angular/core";
import { DriverService } from "./driver.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription, take } from "rxjs";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { SystemLogsService } from "../system-logs/system-logs.service";


@Component({
    selector: 'app-driver',
    templateUrl: 'driver.component.html',
    styleUrls: ['driver.component.css']
})
export class DriverComponent implements OnInit, OnDestroy{

    driver: Driver[] = [];
    driverError: Message[] = [];

    driverForm!: FormGroup;

    visible: boolean = false;

    dialogHeader?: string;

    isLoading: boolean = false;

    submitLoading: boolean = false;

    subscription: Subscription = new Subscription;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    userID!: string;

    constructor(
        private DriverService: DriverService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private UsersService: UsersService,
        private AuthService: AuthService,
        private SystemLogsService: SystemLogsService
    ) {}

    ngOnInit(): void {
        this.driverForm= new FormGroup({
            'DriverID': new FormControl(0),
            'DriverName': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getUser();
        this.getUserAccess(this.userID);
        this.getData();
        this.logDriverView();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getData() {
        this.isLoading = true;
        this.DriverService.getDriverData().subscribe(
            (response) => {
                this.driver = response;
                this.isLoading = false;
            },
            error => {
                console.log(error);
                this.isLoading = false;
                this.driverError = [{ severity: 'error', detail: 'There was an error fetching data' }]
            }
        )
    }

    logDriverView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Driver'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.driverError = [{ severity: 'error', detail: 'Unkown error occured' }]
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

    getUserAccess(UserID: string) {
        this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.11.1':
                                this.view = true;
                                break;
                            case '2.11.2':
                                this.insert = true;
                                break;
                            case '2.11.3':
                                this.edit = true;
                                break;
                            case '2.11.4':
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

    showDialog() {
        this.visible = true;
        this.clearItems();
        this.dialogHeader = 'Add Driver';
    }

    clearItems() {
        this.driverForm.reset();
        this.driverForm.patchValue({DriverID: 0})
    }

    onSubmit() {

        if(!this.driverForm.valid) {
            alert('please fill all the blanks');
            return
        }

        this.submitLoading = true; 

        let authObs: Observable<ResponseData>;
        authObs = this.DriverService.saveData
        (
            this.driverForm.value.DriverID,
            this.driverForm.value.DriverName,
            this.driverForm.value.ContactNumber,
            this.userID
        )

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
                this.getData();
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
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.driverForm.value.DriverName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Driver';

        this.driverForm.setValue({
            DriverID: data.DriverID,
            DriverName: data.DriverName,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.DriverService.onDeleteData(id).subscribe(
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

}

interface Driver {
}
interface ResponseData {
}