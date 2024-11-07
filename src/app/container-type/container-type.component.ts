import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ContainerTypeService } from "./container-type.service";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";




@Component({
    selector: 'app-continer-type',
    templateUrl: 'container-type.component.html',
    styleUrls: ['container-type.component.css']
})
export class ContainerTypeComponent implements OnInit, OnDestroy {

    containerType: any[] = [];

    containerTypeForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    subscription: Subscription = new Subscription;

    constructor(
        private ContainerTypeService: ContainerTypeService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private AuthService: AuthService,
        private UsersService: UsersService

    ) {}

    ngOnInit(): void {
        this.containerTypeForm = new FormGroup({
            'ContainerTypeID': new FormControl(0),
            'Container': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getUser();
        this.getAccess();
        this.getData();
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
                            case '4.7.1':
                                this.view = true;
                                break;
                            case '4.7.2':
                                this.insert = true;
                                break;
                            case '4.7.3':
                                this.edit = true;
                                break;
                            case '4.7.4':
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
        this.ContainerTypeService.getContainerTypeData().subscribe(
            response => {
                this.containerType = response;
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.visible = true;
        this.clearForm();
        this.dialogHeader = 'Add Container Type';
    }

    clearForm() {
        this.containerTypeForm.reset();
        this.containerTypeForm.patchValue({ContainerTypeID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.ContainerTypeService.saveData
        (
            this.containerTypeForm.value.ContainerTypeID,
            this.containerTypeForm.value.Container,
            this.userID
        )

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
                    detail: 'Item: ' + this.containerTypeForm.value.Container +  ' already exist', 
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
        this.dialogHeader = 'Edit Container Type';

        this.containerTypeForm.setValue({
            ContainerTypeID: data.ContainerTypeID,
            Container: data.Container,
            UserID: data.UserID
        })
    }

    // ==== DELETE CONFIRMATION ====
    onDelete(id: any) {
        this.ContainerTypeService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                this.getData();
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

interface ResponseData {

}