import { Component, OnDestroy, OnInit } from "@angular/core";
import { RawMaterialsService } from "./raw-materials.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-raw-materials',
    templateUrl: './raw-materials.component.html',
    styleUrls: ['./raw-materials.component.css']
})
export class RawMaterialsComponent implements OnInit, OnDestroy {

    rawMaterials: RawMats[] = [];

    rawMatsForm!: FormGroup;

    visible: boolean = false;

    isLoading: boolean = false;

    modalHeader!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;
    stockView: boolean = false;

    userID: string = '';

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
                        switch (userRights[i].AccessRight.trim()) {
                            case '2.1.1':
                                this.view = true;
                                break;
                            case '2.1.2':
                                this.insert = true;
                                break;
                            case '2.1.3':
                                this.edit = true;
                                break;
                            case '2.1.4':
                                this.generateReport = true;
                                break;
                            case '2.1.5':
                                this.stockView = true;
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

    toggleDialog() {
        this.visible = !this.visible;
        this.rawMatsForm.reset();
        this.rawMatsForm.patchValue({'RawMaterialID': 0});
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
        // this.clearForm();

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


}

interface RawMats {
}
