import { Component, OnInit } from "@angular/core";
import { GuardService } from "./guard.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";




@Component({
    selector: 'app-guard',
    templateUrl: 'guard.component.html',
    styleUrls: ['guard.component.css']
})
export class GuardComponent implements OnInit {

    guard: any[] = [];

    guardForm!: FormGroup;

    isLoading: boolean = false;
    visible: boolean = false;

    constructor(
        private GuardService: GuardService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {

        this.guardForm = new FormGroup({
            'GuardID': new FormControl(0),
            'GuardName': new FormControl(null, Validators.required),
            'UserID': new FormControl(null)
        })

        this.getAllGuard();
        
    }

    getAllGuard() {
        this.isLoading = true;
        this.GuardService.getAllGuard().subscribe(
            response => {
                this.isLoading = false;
                this.guard = response;
            }
        )
    }

    showDialog() {
        this.clearForm();
        this.visible = true;
    }

    clearForm() {
        this.guardForm.reset();
        this.guardForm.patchValue({GuardID: 0})
    }

    onSubmit() {

        let authObs:Observable<ResponseData>

        const {GuardID, GuardName, UserID} = this.guardForm.value;

        authObs = this.GuardService.saveData
        (
            GuardID,
            GuardName,
            UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully recorded!', life: 3000 });
                this.visible = false;
                this.getAllGuard();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.visible = false;
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated!', life: 3000 });
                this.getAllGuard();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.guardForm.value.GuardName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
        
    }

    onSelect(data: any) {
        this.showDialog();
        
        const {GuardID, GuardName, UserID} = data;

        this.guardForm.setValue({
            GuardID: GuardID,
            GuardName: GuardName,
            UserID: UserID
        })
    }

}

interface ResponseData {

}