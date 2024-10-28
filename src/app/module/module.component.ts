import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModuleService } from "./module.service";
import { Subscription, Observable } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";


@Component({
    selector: 'app-module',
    templateUrl: 'module.component.html',
    styleUrls: ['module.component.css']
})
export class ModuleComponent implements OnInit, OnDestroy{

    module: Module[] = [];

    moduleForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private ModuleService: ModuleService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.moduleForm = new FormGroup({
            'ModuleID': new FormControl(0),
            'ModuleName': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.ModuleService.getModuleData().subscribe(
                (response) => {
                    this.module = response;
                    this.isLoading = false;
                }
            )
        )   
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.visible = true;
        this.dialogHeader = 'Add Module';
        this.clearItems();
    }

    clearItems() {
        this.moduleForm.reset();
        this.moduleForm.patchValue({ModuleID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.ModuleService.saveData(this.moduleForm.value.ModuleID, this.moduleForm.value.ModuleName, this.moduleForm.value.UserID);

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.moduleForm.value.ModuleName +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.moduleForm.value.ModuleName +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.moduleForm.value.ModuleName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
    }

    onSelect(data:any) {
        this.showDialog();
        this.dialogHeader = 'Edit Module';
        
        this.moduleForm.setValue({
            ModuleID: data.ModuleID,
            ModuleName: data.ModuleName,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.ModuleService.onDeleteData(id).subscribe(
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

interface Module {

}

interface ResponseData {

}