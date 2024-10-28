import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ContainerTypeService } from "./container-type.service";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";




@Component({
    selector: 'app-continer-type',
    templateUrl: 'container-type.component.html',
    styleUrls: ['container-type.component.css']
})
export class ContainerTypeComponent implements OnInit{

    containerType: any[] = [];

    containerTypeForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    constructor(
        private ContainerTypeService: ContainerTypeService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.containerTypeForm = new FormGroup({
            'ContainerTypeID': new FormControl(0),
            'Container': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
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
            this.containerTypeForm.value.UserID
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