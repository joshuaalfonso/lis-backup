import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from '../users/users.service';
import { SupplierService } from '../supplier/supplier.service';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';
import { PortOfDischargeService } from '../port-of-discharge/port-of-discharge.service';
import { ImportationService } from './importation.service';

@Component({
  selector: 'app-importation',
  templateUrl: './importation.component.html',
  styleUrls: ['./importation.component.css']
})
export class ImportationComponent implements OnInit, OnDestroy {


    tabValue: string = 'Active';
    statusValue: number = 1;
 
    contract: any[] = [];
    isLoading: boolean = false;

    contractDialogVisible: boolean = false;

    subscriptions: Subscription = new Subscription;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    supplier: any[] = [];
    rawMaterial: any[] = [];
    portOfDischarge: any[] = [];

    selectedContractRow: {} | null = null;

    constructor(
        private auth: AuthService,
        private userService: UsersService,
        private supplierService: SupplierService,
        private rawMaterialService: RawMaterialsService,
        private portOfDischargeService: PortOfDischargeService,
        private importationService: ImportationService
    ) {}

    ngOnInit(): void {
        this.getUser();
        this.getContract();
        this.getSupplier();
        this.getRawMaterials();
        this.getPortOfDischarge();
    }

    ngOnDestroy(): void {
        
    }

    getUser() {
        this.subscriptions.add(
            this.auth.user.pipe(take(1)).subscribe(
                user => {
                    if (user) {
                        this.userID = user!.user_id;
                        this.getUserAccess(this.userID);
                    }
                }  
            )
        )
    }

    getUserAccess(UserID: string) {
        this.subscriptions.add(
            this.userService.getUserAccess(UserID).subscribe(
                response => {
                    let userRights = response;
                 
                    for (let i = 0; i < userRights.length; i++) {
                        switch (userRights[i].AccessRight.trim()) {
                            case '3.2.1':
                                this.view = true;
                                break;
                            case '3.2.2':
                                this.insert = true;
                                break;
                            case '3.2.3':
                                this.edit = true;
                                break;
                            case '3.2.4':
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

    getContract() {
        this.isLoading = true;
        this.subscriptions.add(
            this.importationService.getContractPerformaFilter(this.tabValue)
            .subscribe(
                response => {
                    this.isLoading = false;
                    this.contract = response;
                    // console.log(this.contract)
                },
                err => {
                    this.isLoading = false
                    console.error(err)
                }
            )
        )
    }

    getSupplier() {
        this.subscriptions.add(
            this.supplierService.getSupplierData().subscribe(
                response => {
                    this.supplier = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }

    getRawMaterials() {
        this.subscriptions.add(
            this.rawMaterialService.getRawMatsData().subscribe(
                response => {
                    this.rawMaterial = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }

    getPortOfDischarge() {
        this.subscriptions.add(
            this.portOfDischargeService.getData().subscribe(
                response => {
                    this.portOfDischarge = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }

    showContractDialog(row?: any) {
        this.selectedContractRow = row || null;
        this.contractDialogVisible = true;
    }

    closeContractDialog() {
        this.contractDialogVisible = false;
        this.selectedContractRow = null;
    }


}
