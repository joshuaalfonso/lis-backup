import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IndentorService } from "./indentor.service";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";




@Component({
    selector: 'app-indentor',
    templateUrl: 'indentor.component.html',
    styleUrls: ['indentor.component.css']
})
export class IndentorComponent implements OnInit{

    indentor: any[] = [];
    indentorForm!: FormGroup;

    isLoading: boolean = false;

    visible: boolean = false;

    dialogHeader?: string;

    constructor(
        private IndentorService: IndentorService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.indentorForm = new FormGroup({
            'IndentorID': new FormControl(0),
            'Indentor': new FormControl(null, Validators.required),
            'Address': new FormControl(null, Validators.required),
            'ContactPerson': new FormControl(null, Validators.required),
            'ContactNumber': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = false;
        this.IndentorService.getIndentorData().subscribe(
            response => {
                this.indentor = response;
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Indentor';
        this.clearItems();
    }

    clearItems() {
        this.indentorForm.reset();
        this.indentorForm.patchValue({IndentorID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.IndentorService.saveData
        (
            this.indentorForm.value.IndentorID,
            this.indentorForm.value.Indentor,
            this.indentorForm.value.Address,
            this.indentorForm.value.ContactPerson,
            this.indentorForm.value.ContactNumber,
            this.indentorForm.value.UserID,
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.indentorForm.value.Indentor +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.indentorForm.value.Indentor +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.indentorForm.value.Indentor +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Indentor';

        this.indentorForm.setValue({
            IndentorID: data.IndentorID,
            Indentor: data.Indentor,
            Address: data.Address,
            ContactPerson: data.ContactPerson,
            ContactNumber: data.ContactNumber,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.IndentorService.onDeleteData(id).subscribe(
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

interface ResponseData {

}