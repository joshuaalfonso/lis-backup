import { Component, OnDestroy, OnInit } from "@angular/core";
import { PortOfDischargeService } from "./port-of-discharge.service";
import { Observable, Subscription, take } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Message, MessageService } from "primeng/api";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";
import { SystemLogsService } from "../system-logs/system-logs.service";


@Component({
    selector: 'app-port-of-discharge',
    templateUrl: 'port-of-discharge.component.html',
    styleUrls: ['port-of-discharge.component.css']
})
export class PortOfDischarge implements OnInit, OnDestroy{

    private subscription: Subscription = new Subscription;

    portOfDischarge: any[] = [];
    portOfDischargeError: Message[] = [];

    portOfDischargeForm!: FormGroup;

    isLoading: boolean = false;

    visible: boolean = false;

    dialogHeader?: string;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    constructor(
        private PortOfDischargeService: PortOfDischargeService,
        private MessageService: MessageService,
        private AuthService: AuthService,
        private UsersService: UsersService,
        private SystemLogsService: SystemLogsService
    ) {}

    ngOnInit(): void {

        this.portOfDischargeForm = new FormGroup({
            'PortOfDischargeID': new FormControl(0),
            'PortOfDischarge': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getUser();
        this.getAccess();
        this.getData();
        this.logPortOfDischargeView();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
                            case '4.4.1':
                                this.view = true;
                                break;
                            case '4.4.2':
                                this.insert = true;
                                break;
                            case '4.4.3':
                                this.edit = true;
                                break;
                            case '4.4.4':
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
        this.PortOfDischargeService.getData().subscribe(
            response => {
                this.portOfDischarge = response;
                this.isLoading = false;
            },
            error => {
                console.log(error);
                this.isLoading = false;
                this.portOfDischargeError = [{ severity: 'error', detail: 'There was an error fetching data' }]
            }
        )
    }

    logPortOfDischargeView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Port of Discharge'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.portOfDischargeError = [{ severity: 'error', detail: 'Unkown error occured' }]
            }
        );

    }

    showDialog() {
        this.clearForm();
        this.visible = true;
        this.dialogHeader = 'Add Port Of Discharge';
    }

    clearForm() {
        this.portOfDischargeForm.reset();
        this.portOfDischargeForm.patchValue({PortOfDischargeID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.PortOfDischargeService.saveData
        (
            this.portOfDischargeForm.value.PortOfDischargeID,
            this.portOfDischargeForm.value.PortOfDischarge,
            this.userID
        )

        authObs.subscribe(response => {

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
                    detail: 'Item: ' + this.portOfDischargeForm.value.PortOfDischarge +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Port of Discharge'
        this.portOfDischargeForm.setValue({
            PortOfDischargeID: data.PortOfDischargeID,
            PortOfDischarge: data.PortOfDischarge,
            UserID: data.UserID,
        })
    }

}

interface ResponseData {

}