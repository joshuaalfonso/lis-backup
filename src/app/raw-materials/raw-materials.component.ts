import { Component, OnDestroy, OnInit } from "@angular/core";
import { RawMaterialsService } from "./raw-materials.service";
import { Message } from 'primeng/api';
import { ConfirmationService, MessageService } from "primeng/api";
import { Subscription, take } from "rxjs";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { RawMaterial } from "./raw-materials.model";
import { SystemLogsService } from "../system-logs/system-logs.service";

@Component({
    selector: 'app-raw-materials',
    templateUrl: './raw-materials.component.html',
    styleUrls: ['./raw-materials.component.css']
})
export class RawMaterialsComponent implements OnInit, OnDestroy {

    rawMaterials: RawMaterial[] = [];
    isLoading: boolean = false;
    rawMaterialError: Message[] = [];
    selectedRawMaterial!: RawMaterial | null;

    visible: boolean = false;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;
    stockView: boolean = false;

    userID: string = '';

    private subscription: Subscription = new Subscription();

    constructor( 
        private RawMaterialsService: RawMaterialsService,
        private MessageService: MessageService,
        private ConfirmationService: ConfirmationService,
        private auth: AuthService,
        private UsersService: UsersService,
        private SystemLogsService: SystemLogsService
    ){}

    ngOnInit(): void {

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

        this.getData();
        this.logRawMaterialView();

    }

    // ==== GET RAW MATERIALS DATA ====
    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.RawMaterialsService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterials = response;
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.isLoading = false;
                    this.rawMaterialError = [{ severity: 'error', detail: 'There was an error fetching data' }]
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

    logRawMaterialView() {

        if (!this.userID) {
            alert('No logged in user');
            return
        }

        const data = {
            UserID: this.userID,
            TableName: 'Raw Material'
        }

        this.SystemLogsService.sytemLogView(data).pipe(take(1)).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
                this.rawMaterialError = [{ severity: 'error', detail: 'An unkown error occured' }]
            }
        );

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openDialog(rawMaterial: any) {
        this.selectedRawMaterial = rawMaterial;
        this.visible = true;
    }

    closeDialog() {
        this.selectedRawMaterial = null;
        this.visible = false;
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

