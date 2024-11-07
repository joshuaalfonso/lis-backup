import { Component, OnDestroy, OnInit } from "@angular/core";
import { CheckerScheduleService } from "./checker-schedule.service";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WarehouseLocationService } from "../warehouse-location/warehouse-location.service";
import { MessageService } from "primeng/api";
import { PlantService } from "../plant/plant.service";
import { CheckerType } from "../checker-type/checker-type.component";
import { CheckerTypeService } from "../checker-type/checker-type.service";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";



@Component({
    selector: 'app-checker-schedule',
    templateUrl: 'checker-schedule.component.html',
    styleUrls: ['checker-schedule.component.css']
})
export class CheckerScheduleComponent implements OnInit, OnDestroy{

    checkerSchedule: any[] = [];
    checker: any[] = [];
    warehouseLocation: any[] = [];
    plant: any[] = [];
    checkerType: any[] = [];

    checkerScheduleForm!: FormGroup;

    isLoading: boolean = false;
    visible: boolean = false;
    modalHeader: string = '';

    selectedCheckerType!: number;

    submitLoading: boolean = false;

    userID!: string;

    private subscriptions: Subscription = new Subscription;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    constructor(
        private CheckerScheduleService: CheckerScheduleService,
        private WarehouseLocationService: WarehouseLocationService,
        private MessageService: MessageService,
        private PlantService: PlantService,
        private CheckerTypeService: CheckerTypeService,
        private AuthService: AuthService,
        private UsersService: UsersService
    ) {}

    ngOnInit(): void {  

        this.checkerScheduleForm = new FormGroup({
            'ScheduleRotationID': new FormControl(null),
            'UserID': new FormControl(null, Validators.required),
            'TypeID': new FormControl(null, Validators.required),
            'LocationID': new FormControl(null),
            'PlantID': new FormControl(null),
            'DateRotation': new FormControl(null, Validators.required),
            'AdminUserID': new FormControl()
        })


        this.getUser();
        this.getUserAccess(this.userID);
        this.getData();
        this.getChecker();
        this.getWarehouseLocation();
        this.getPlant();
        this.getCheckerType();

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getUser() {
        this.subscriptions.add(
            this.AuthService.user.subscribe(
                user => {
                    if (user) {
                        this.userID = user.user_id; 
                    }
                }
            )
        )
    }

    getUserAccess(UserID: string) {
        this.subscriptions.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.13.1':
                                this.view = true;
                                break;
                            case '2.13.2':
                                this.insert = true;
                                break;
                            case '2.13.3':
                                this.edit = true;
                                break;
                            case '2.13.4':
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
        this.subscriptions.add(
            this.CheckerScheduleService.displayData().subscribe(
                response => {
                    this.checkerSchedule = response
                },
                err => {
                    console.error('Error fetching checker schedule:', err);
                }
            )
        )
    }

    getChecker() {
        this.subscriptions.add(
            this.CheckerScheduleService.checkerData().subscribe(
                response => {
                    this.checker = response
                },
                err => {
                    console.error('Error fetching checker:', err);
                }
            )
        )
    }

    getWarehouseLocation() {
        this.subscriptions.add(
            this.WarehouseLocationService.getWarehouseLocationData().subscribe(
                response => {
                    this.warehouseLocation = response
                },
                err => {
                    console.error('Error fetching warehouse location data:', err);
                }
            )
        )
    }

    getPlant() {
        this.subscriptions.add(
            this.PlantService.getPlantData().subscribe(
                response => {
                    this.plant = response
                }, 
                err => {
                    console.error('Error fetching plant data:', err);
                }
            )
        )
    }

    getCheckerType() {
        this.subscriptions.add(
            this.CheckerTypeService.getCheckerTypeData().subscribe(
                response => {
                    this.checkerType = response;
                },
                err => {
                    console.error('Error fetching checker type data:', err);
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

        this.submitLoading = true;
        
        this.CheckerScheduleService.saveData(
            this.checkerScheduleForm.value.ScheduleRotationID,
            this.checkerScheduleForm.value.UserID,
            this.checkerScheduleForm.value.TypeID,
            this.checkerScheduleForm.value.PlantID,
            this.checkerScheduleForm.value.LocationID,
            this.checkerScheduleForm.value.DateRotation.toLocaleDateString(),
            this.userID
        )
        .subscribe(response => {
            this.submitLoading = false;
            
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

            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Warning', detail:'Checker already exist', life: 3000 });
            }
                    
        },  errorMessage => {
            this.submitLoading = false;
            this.MessageService.add({ severity: 'error', summary: 'Warning', detail: errorMessage, life: 3000 });
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

        this.onSelectCheckerType(data.TypeID)
        // this.selectedCheckerType = data.TypeID;

        this.checkerScheduleForm.setValue({
            ScheduleRotationID: data.ScheduleRotationID,
            UserID: data.UserID,
            TypeID: data.TypeID,
            PlantID: data.PlantID,
            LocationID: data.WarehouseLocationID,
            DateRotation: new Date(data.DateRotation.date),
            AdminUserID: data.AdminUserID
        })

    }

    onSelectCheckerType(checkerTypeID: number) {

        this.checkerScheduleForm.patchValue({
            PlantID: null,
            LocationID: null
        })

        this.selectedCheckerType = checkerTypeID;

        this.checkerScheduleForm.get('LocationID')?.clearValidators();
        this.checkerScheduleForm.get('PlantID')?.clearValidators();

        if (checkerTypeID === 1) {
            this.checkerScheduleForm.get('LocationID')?.setValidators(Validators.required);
        } else if (checkerTypeID === 2) {
            this.checkerScheduleForm.get('PlantID')?.setValidators(Validators.required);
        }

        // Update the form control states
        this.checkerScheduleForm.get('LocationID')?.updateValueAndValidity();
        this.checkerScheduleForm.get('PlantID')?.updateValueAndValidity();

    }

}