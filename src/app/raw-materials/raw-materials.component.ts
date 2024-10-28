import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { RawMaterialsService } from "./raw-materials.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Subscription } from "rxjs";
import { Table } from "primeng/table";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";


@Component({
    selector: 'app-raw-materials',
    templateUrl: './raw-materials.component.html',
    styleUrls: ['./raw-materials.component.css']
})
export class RawMaterialsComponent implements OnInit, OnDestroy {

    value: string | undefined;

    rawMaterials: RawMats[] = [];

    rawMatsForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    modalHeader!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    userID: string = '';

    items: any[] | undefined;

    activeItem:any;

    rowOptions: any[] = [];

    submitLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor( 
        private RawMaterialsService: RawMaterialsService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private auth: AuthService,
        private UsersService: UsersService,
        private router: Router
    ){}

    ngOnInit(): void {

        this.rawMatsForm = new FormGroup({
            'RawMaterialID': new FormControl(0),
            'RawMaterial': new FormControl(null, Validators.required),
            'Quantity': new FormControl(0),
            'Weight': new FormControl(0),
            'MinimumQuantity': new FormControl(null, Validators.required),
            'MinimumWeight': new FormControl(null, Validators.required),
            'Category': new FormControl(null, Validators.required),
            // 'Packaging': new FormControl(null, Validators.required),
            'UserID': new FormControl(0),
        });

        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Refresh',
                        icon: 'pi pi-refresh',
                        command: () => {
                            this.getData();
                        }
                    },
                    {
                        label: 'Export',
                        icon: 'pi pi-upload'
                    }
                ]
            }
        ];

        this.rowOptions = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-pencil',
                        command: () => {
                            this.onSelect(this.activeItem);
                        }
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-trash'
                    }
                ]
            }
        ]

        this.subscription.add(
            this.auth.user.subscribe(
                user => {
                    if (user) {
                        this.userID = user!.user_id;
                        this.getUserAccess(this.userID);
                    }
                }
            )
        )

        // ==== DISPLAY RAW MATERIALS DATA ====
        this.getData();
    }

    // ==== GET RAW MATERIALS DATA ====
    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.RawMaterialsService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterials = response;
                    this.isLoading = false;
                }
            )
        )
    }




    getUserAccess(UserID: string) {
       this.subscription.add(
            this.UsersService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;

                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight) {
                            case 1.1:
                                this.view = true;
                                break;
                            case 1.2:
                                this.insert = true;
                                break;
                            case 1.3:
                                this.edit = true;
                                break;
                            case 1.4:
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // ==== SHOW MODAL ====
    showDialog() {

        if(!this.insert) {

            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });

            return;
        }

        this.visible = true;
        this.modalHeader = 'Add Raw Material';
        this.clearForm();

    }

    // ==== RESET FORM ====
    clearForm() {
        this.rawMatsForm.reset();
        this.rawMatsForm.patchValue({'RawMaterialID': 0});
    }

    // ==== SUBMIT FORM DATA ====
    onSubmit() {
        if (!this.rawMatsForm.valid) {
            console.log('Please fill all the blanks')
        }

        this.submitLoading = true;


        let authObs: Observable<ResponseData>;
        authObs = this.RawMaterialsService.saveData
        (
            this.rawMatsForm.value.RawMaterialID, 
            this.rawMatsForm.value.RawMaterial, 
            this.rawMatsForm.value.Category, 
            this.rawMatsForm.value.Packaging, 
            this.rawMatsForm.value.Quantity, 
            this.rawMatsForm.value.Weight, 
            this.rawMatsForm.value.MinimumQuantity, 
            this.rawMatsForm.value.MinimumWeight, 
            this.userID
        );

        authObs.subscribe(response =>{

            this.submitLoading = false;

            if( response === 1) {

                this.visible = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail:'Successfully recorded!', 
                    life: 3000 
                });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {

                this.visible = false;
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated!', 
                    life: 3000 
                });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {

                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Danger', 
                    detail: 'Item: ' + this.rawMatsForm.value.RawMaterial +  ' already exist', 
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

            this.submitLoading = false;
        })
    }

    // ==== EDIT ITEM ====
    onSelect(data: any) {

        if (!this.edit) {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: 'You are not authorized!', 
                life: 3000 
            });

            return;
        } 

        this.showDialog();
        this.modalHeader = 'Edit Raw Material';

        this.rawMatsForm.setValue({
            'RawMaterialID': data.RawMaterialID,
            'RawMaterial': data.RawMaterial,
            'Quantity': data.Quantity,
            'Weight': data.Weight,
            'MinimumQuantity': data.MinimumQuantity,
            'MinimumWeight': data.MinimumWeight,
            'Category': data.Category,
            'UserID': this.userID,
        });

        // console.log(data);
    }

    // ==== DELETE CONFIRMATION ====
    onDelete(id: any) {
        this.RawMaterialsService.onDeleteData(id).subscribe(
            response => {
               if (response === 3 ) {
                    this.MessageService.add({ 
                        severity: 'info', 
                        summary: 'Confirmed', 
                        detail: 'Record deleted', 
                        life: 3000 
                    });
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

    // ==== INPUT SEARCH DATA====
     onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(inputValue, 'contains');
    }


}

interface RawMats {
}
interface ResponseData {
}