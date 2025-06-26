import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from '../users/users.service';
import { SupplierService } from '../supplier/supplier.service';
import { RawMaterialsService } from 'src/app/raw-materials/raw-materials.service';
import { PortOfDischargeService } from '../port-of-discharge/port-of-discharge.service';
import { ImportationService } from './importation.service';
import { ActivatedRoute } from '@angular/router';
import { ShippingLineService } from '../shipping-line/shipping-line.service';
import { ContainerTypeService } from '../container-type/container-type.service';
import { BrokerService } from '../broker/broker.service';
import { BankService } from '../bank/bank.service';
import { Dialog } from 'primeng/dialog';
import { CreateShippingTransactionComponent } from 'src/app/features/importation/create-shipping-transaction/create-shipping-transaction.component';

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
    shippingDialogVisisble: boolean = false;

    shippingTransaction: any[] = [];
    shippingTransactionIsLoading: boolean = false;

    subscriptions: Subscription = new Subscription;

    userID!: string;

    view: boolean = false;
    insert: boolean = false;
    edit: boolean = false;
    generateReport: boolean = false;

    supplier: any[] = [];
    rawMaterial: any[] = [];
    portOfDischarge: any[] = [];
    shippingLine: any[] = [];
    containerType: any[] = [];
    broker: any[] = [];
    bank: any[] = [];

    selectedContractRow: {} | null = null;
    selectedContractID: number = 0;
    selectedShippingRow: {} | null = null;

    @ViewChild(CreateShippingTransactionComponent) shippingDialogComp!: CreateShippingTransactionComponent;

    constructor(
        private auth: AuthService,
        private userService: UsersService,
        private supplierService: SupplierService,
        private rawMaterialService: RawMaterialsService,
        private portOfDischargeService: PortOfDischargeService,
        private importationService: ImportationService,
        private shippingLineService: ShippingLineService,
        private containerTypeService: ContainerTypeService,
        private brokerService: BrokerService,
        private bankService: BankService,
    ) {}

    ngOnInit(): void {
        this.getUser();
        this.getContract();
        this.getSupplier();
        this.getRawMaterials();
        this.getPortOfDischarge();
        this.getShippingLine();
        this.getContainerType();
        this.getBroker();
        this.getShippingTransaction();
        this.getBank();

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // get user id 
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

    // get user access
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

    // get contract
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

    // get shipping transaction
    getShippingTransaction() {
        this.shippingTransactionIsLoading = true;
        this.subscriptions.add(
            this.importationService.getShippingTransactionFilter(this.statusValue, this.selectedContractID)
            .subscribe(response => {
                this.shippingTransaction = response;
                this.shippingTransactionIsLoading = false;
                // console.log(response)
            }, error => {
                this.shippingTransactionIsLoading = false;
                console.log(error)
            })
        )
    }

    // selecte contract
    onSelectContract(contractID: number) {

        if (this.selectedContractID === contractID) {
            this.selectedContractID = 0;
            this.getShippingTransaction();
            return;
        }

        this.selectedContractID = contractID;
        this.getShippingTransaction();
        // console.log(this.selectedContractID);
    }

    onRemoveContract(contractPerformaID: number) {
        this.contract = this.contract.filter(item => item.ContractPerformaID !== contractPerformaID);     
        this.shippingTransaction = this.shippingTransaction.filter(item => item.ContractPerformaID !== contractPerformaID);
    }

    onRemoveShipping(shippingTransactionID: number) {
        this.shippingTransaction = this.shippingTransaction.filter(item => item.ShippingTransactionID !== shippingTransactionID);
    }

    onSelectShippingTransactionStatus(event: any) {

        const selectedStatus = Number(event.value);

        if (selectedStatus === this.statusValue) return;

        this.statusValue = selectedStatus;

        this.getShippingTransaction();

        // console.log(selectedStatus)
    }


    // get supplier
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

    // get raw materials
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

    // get port of discharge
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

    // get shipping line
    getShippingLine() {
        this.subscriptions.add(
            this.shippingLineService.getShippingLineData().subscribe(
                response => {
                    this.shippingLine = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }


    getContainerType() {
        this.subscriptions.add(
            this.containerTypeService.getContainerTypeData().subscribe(
                response => {
                    this.containerType = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }

    getBroker() {
        this.subscriptions.add(
            this.brokerService.getBrokerData().subscribe(
                response => {
                    this.broker = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }

    getBank() {
        this.subscriptions.add(
            this.bankService.getData().subscribe(
                response => {
                    this.bank = response;
                },
                err => {
                    console.error(err)
                }
            )
        )
    }

    // contract dialog
    showContractDialog(row?: any) {
        this.selectedContractRow = row || null;
        this.contractDialogVisible = true;
    }

    // close contract dialog
    closeContractDialog() {
        this.contractDialogVisible = false;
        this.selectedContractRow = null;
    }

    // show shipping transaction dialog
    showShippingDialog(row?: any) {
        this.selectedShippingRow = row || null;
        this.shippingDialogVisisble = true;
        // console.log(this.shippingDialogVisisble)
        console.log(row);
        this.shippingDialogComp.maximize();
    }

    // close shipping transaction dialog
    closeShippingDialog() {
        this.shippingDialogVisisble = false;
        this.selectedShippingRow = null;
    }


}
