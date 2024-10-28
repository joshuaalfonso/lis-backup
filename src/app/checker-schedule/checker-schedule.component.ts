import { Component, OnDestroy, OnInit } from "@angular/core";
import { CheckerScheduleService } from "./checker-schedule.service";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WarehouseLocationService } from "../warehouse-location/warehouse-location.service";
import { MessageService } from "primeng/api";



@Component({
    selector: 'app-checker-schedule',
    templateUrl: 'checker-schedule.component.html',
    styleUrls: ['checker-schedule.component.css']
})
export class CheckerScheduleComponent implements OnInit, OnDestroy{

    checkerSchedule: any[] = [];
    checker: any[] = [];
    warehouseLocation: any[] = [];

    checkerScheduleForm!: FormGroup;

    isLoading: boolean = false;
    visible: boolean = false;
    modalHeader: string = '';

    private subscriptions: Subscription = new Subscription;

    constructor(
        private CheckerScheduleService: CheckerScheduleService,
        private WarehouseLocationService: WarehouseLocationService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {  
        this.checkerScheduleForm = new FormGroup({
            'ScheduleRotationID': new FormControl(null),
            'UserID': new FormControl(null, Validators.required),
            'WarehouseLocationID': new FormControl(null, Validators.required),
            'DateRotation': new FormControl(null, Validators.required),
            'AdminUserID': new FormControl()
        })


        this.getData();
        this.getChecker();
        this.getWarehouseLocation();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getData() {
        this.subscriptions.add(
            this.CheckerScheduleService.displayData().subscribe(
                response => {
                    this.checkerSchedule = response
                }
            )
        )
    }

    getChecker() {
        this.subscriptions.add(
            this.CheckerScheduleService.checkerData().subscribe(
                response => {
                    this.checker = response
                }
            )
        )
    }

    getWarehouseLocation() {
        this.subscriptions.add(
            this.WarehouseLocationService.getWarehouseLocationData().subscribe(
                response => {
                    this.warehouseLocation = response
                }
            )
        )
    }

    showDialog() {
        this.clearItems();
        this.modalHeader = 'Add Schedule';
        this.visible = true;
    }

    clearItems() {
        this.checkerScheduleForm.reset();
        this.checkerScheduleForm.patchValue({
            ScheduleRotationID: 0
        })
    }

    onSubmit() {
        
        this.CheckerScheduleService.saveData(
            this.checkerScheduleForm.value.ScheduleRotationID,
            this.checkerScheduleForm.value.UserID.UserID,
            this.checkerScheduleForm.value.WarehouseLocationID.WarehouseLocationID,
            this.checkerScheduleForm.value.DateRotation.toLocaleDateString(),
            this.checkerScheduleForm.value.AdminUserID
        )
        .subscribe(response => {
            
            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail:'Successfully recorded', life: 3000 });
                this.getData();
                this.clearItems;
                this.visible = false;
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail:'Successfully updated', life: 3000 });
                this.getData();
                this.clearItems();
                this.visible = false;
            }
                    
        },  errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        })

    }

    findObjectByID( selectedID: number, idName: string, array: any[]) {
        for (let i = 0; i <= array.length -1; i++) {
            if (selectedID == array[i][idName]) {
                return array[i];
            }
        }
        return null; 
    }

    onSelect(data: any) {
        this.clearItems();
        this.modalHeader = 'Edit Schedule';
        this.visible = true;

        let CheckerValue = this.findObjectByID(data.UserID.toUpperCase(), 'UserID', this.checker);
        let LocationValue = this.findObjectByID(data.WarehouseLocationID, 'WarehouseLocationID', this.warehouseLocation);
        // console.log(data.UserID.toUpperCase())

        this.checkerScheduleForm.setValue({
            ScheduleRotationID: data.ScheduleRotationID,
            UserID: CheckerValue,
            WarehouseLocationID: LocationValue,
            DateRotation: new Date(data.DateRotation.date),
            AdminUserID: data.AdminUserID
        })

    }
}