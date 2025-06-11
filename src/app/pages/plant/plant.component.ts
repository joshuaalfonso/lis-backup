import { Component, OnDestroy, OnInit } from "@angular/core";
import { PlantService } from "./plant.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";



@Component({
    selector: 'app-plant',
    templateUrl: 'plant.component.html',
    styleUrls: ['plant.component.css']
})
export class PlantComponent implements OnInit, OnDestroy{

    plant: Plant[]= [];

    plantForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private PlantService: PlantService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.plantForm = new FormGroup({
            'PlantID': new FormControl(0),
            'PlantName': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.PlantService.getPlantData().subscribe(
                (response) => {
                    this.plant = response;
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
        this.dialogHeader = 'Add Plant';
        this.clearForm();
    }

    clearForm() {
        this.plantForm.reset();
        this.plantForm.patchValue({PlantID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.PlantService.saveData(this.plantForm.value.PlantID, this.plantForm.value.PlantName, this.plantForm.value.UserID);

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.plantForm.value.PlantName +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item: ' + this.plantForm.value.PlantName +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.plantForm.value.PlantName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });
    }

    onSelect(data: any) {
        this.showDialog();
        this.dialogHeader = 'Edit Plant';

        this.plantForm.setValue({
            PlantID: data.PlantID,
            PlantName: data.PlantName,
            UserID: data.UserID
        })
    }

    onDelete(id: any) {
        this.PlantService.onDeleteData(id).subscribe(
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

interface Plant{

}
interface ResponseData {

}