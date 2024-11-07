import { Component, OnDestroy, OnInit } from "@angular/core";
import { UsersService } from "./users.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModuleService } from "../module/module.service";
import { Observable, Subscription } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Dialog } from "primeng/dialog";
import { AuthService } from "../auth/auth.service";




@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy{

    users: any[] = [];

    userForm!: FormGroup;

    isLoading: boolean = false;

    visible: boolean = false;

    visibleAccessModue: boolean = false;

    dialogHeader : string = '';

    module: any[] = [];

    userAccessForm!: FormGroup;

    moduleAccess: any[] = []

    selectedAccess: any[] = [];
    currentModuleAccess: any[] = [];

    department: any[] = [];

    submitLoading: boolean = false;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    private subscription: Subscription = new Subscription;

    constructor(
        private UsersService: UsersService,
        private ModuleService: ModuleService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private AuthService: AuthService
    ) {}

    ngOnInit(): void {
        this.userForm = new FormGroup({
            'UserID': new FormControl(0),
            'UName': new FormControl(null, Validators.required), 
            // 'PWord': new FormControl(null, Validators.required), 
            'DepartmentID': new FormControl(null, Validators.required), 
            'ULevel': new FormControl(null, Validators.required), 
            'Name': new FormControl(null, Validators.required), 
            'ContactNo': new FormControl(null, Validators.required), 
            'EmailAdd': new FormControl(null, Validators.required), 
        })

        this.userAccessForm = new FormGroup({
            UserID: new FormControl(0),
            Name: new FormControl(null),
            AdminID: new FormControl(0)
        })

        this.getUser();
        this.getAccess();
        this.getData();
        this.getModule();
        this.getModuleAccess();
        this.getDepartment();
    }

    getUser() {
        this.subscription.add(
            this.AuthService.user.subscribe(user => {
                if(user) {
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
                            case '4.1.1':
                                this.view = true;
                                break;
                            case '4.1.2':
                                this.insert = true;
                                break;
                            case '4.1.3':
                                this.edit = true;
                                break;
                            case '4.1.4':
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
            this.UsersService.getData().subscribe(
                response => {
                    this.isLoading = false;
                    this.users = response;
                }
            )
        )
    }

    getModule() {
        this.subscription.add(
            this.ModuleService.getModuleData().subscribe(
                response => {
                    this.module = response;
                }
            )
        )
    }

    getModuleAccess() {
        this.subscription.add(
            this.UsersService.getModuleAccess().subscribe(
                response => {
                    this.moduleAccess = response;
                }
            )
        )
    }

    getDepartment() {
        this.subscription.add(
            this.UsersService.getDepartment().subscribe(
                response => {
                    this.department = response;
                }
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.dialogHeader = 'Add User'
        this.clearForm();
        this.visible = true;
    }

    clearForm() {
        this.userForm.reset();
        this.userForm.patchValue({UserID: 0});
    }


    onSubmit() {

        this.submitLoading = true;

        let authObs: Observable<ResponseData>
        authObs = this.UsersService.saveData
        (
            this.userForm.value.UserID,
            this.userForm.value.UName,
            // this.userForm.value.PWord,
            this.userForm.value.DepartmentID.DepartmentID,
            this.userForm.value.ULevel.ModuleID,
            this.userForm.value.Name,
            this.userForm.value.ContactNo,
            this.userForm.value.EmailAdd,
        )

        authObs.subscribe(response =>{
            this.submitLoading = false;

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
                this.visible = false;
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
                this.visible = false;
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.userForm.value.UName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
    }

       // find object for dropdown
    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID === array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit User';

        let ULevelValue = this.findObjectByID(data.ULevel, 'ModuleID', this.module);
        let DepartmentValue = this.findObjectByID(data.DepartmentID, 'DepartmentID', this.department);

        this.userForm.setValue({
            UserID: data.UserID,
            UName: data.UName,
            // PWord: data.PWord,
            DepartmentID: DepartmentValue,
            ULevel: ULevelValue,
            Name: data.Name,
            ContactNo: data.ContactNo,
            EmailAdd: data.EmailAdd
        })
    }

    onResetPassword(data: any) {
        
        let authObs: Observable<ResponseData>
        authObs = this.UsersService.resetPassword
        (
            data.UserID,
            data.UName
        )

        authObs.subscribe(response =>{

            if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Password successfully reset!', life: 3000 });
                this.getData();
                this.clearForm();
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
    }

    confirm1(event: Event, data: any) {
        this.ConfirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to reset?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                // this.ConfirmationService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                this.onResetPassword(data);
            },
            reject: () => {
                // this.ConfirmationService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }

    //     find object for dropdown
    findExistingID(selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][idName] === selectedID) {
                array.splice(i, 1);
                break; 
            }
        }
    }

    showAccessModal(data: any, dialog: Dialog) {
        
        dialog.maximize();
        this.visibleAccessModue = true;
        this.selectedAccess = [];
        this.currentModuleAccess = [...this.moduleAccess];
        this.userAccessForm.setValue({
            UserID: data.UserID,
            AdminID: 0,
            Name: data.Name
        })

        this.UsersService.getUserAccess(data.UserID).subscribe(
            response => {
                for (let i = 0; i < response.length; i++) {
                    this.selectedAccess = [...this.selectedAccess, response[i]]

                    this.findExistingID(response[i].AccessRight, 'AccessRight', this.currentModuleAccess);  
                }
            }
           
        )

    }

    onSubmitUserAccess() {

        let authObs: Observable<ResponseData>
        authObs = this.UsersService.saveUserAccess
        (
            this.userAccessForm.value.UserID,
            this.userAccessForm.value.AdminID,
            this.selectedAccess
        )

        authObs.subscribe(response =>{

            if ( response === 1) {
                this.visibleAccessModue = false;
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated!', life: 3000 });
                this.getData();
                this.clearForm();
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });

    }

}

interface ResponseData {

}