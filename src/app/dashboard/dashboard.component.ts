import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { AppComponent } from "../app.component";
import { WarehouseLocationService } from "../warehouse-location/warehouse-location.service";
import { RawMaterialsService } from "../raw-materials/raw-materials.service";
import { ContractPerformaService } from "../contract-performa/contract-performa.service";
import { UnloadingTransactionService } from "../unloading-transaction/unloading-transaction.service";
import { MessageService } from "primeng/api";
import { BinloadService } from "../binload/binload.service";
import { TransferService } from "../raw-material-transfer/transfer.service";



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

    data: any;
    data2: any;
    options: any;
    options2: any;

    userName: string | null = null;

    userID!: string;

    userSubscription?: Subscription;

    warehouseLocation: any[] = [];
    rawMaterial: any[] = [];
    landedShipping: any[] = [];

    subscriptions: Subscription = new Subscription;

    cardsLoading: boolean = false;

    rawmatsLoading: boolean = false;

    unloadLoading: boolean = false;

    transferLoading: boolean = false;

    receivedLoading: boolean = false;

    counter:number = 0;

    unloading: any[] = [];

    recentBinload: any[] = [];

    recentTransfer: any[] = [];

    isnightMode!: boolean;

    selectedOption: number = 1;

    products: any[] = [];

    // @Output() sidebarToggled = new EventEmitter<boolean>();

    constructor(
        private AuthService: AuthService,
        private AppComponent: AppComponent,
        private WarehouseLocationService: WarehouseLocationService,
        private RawMaterialService: RawMaterialsService,
        private ContractPerformaService: ContractPerformaService,
        private UnloadingService: UnloadingTransactionService,
        private MessageService: MessageService,
        private BinloadService: BinloadService,
        private RawMaterialTransferService: TransferService
    ) {}

        
    ngOnInit(): void {

        this.getRawMaterial();
        this.getWarehouseLocation();
        this.getLandedShipping();
        this.getUnloadingTransaction();
        this.getRecentBinload();
        this.getRecentTransfer();

        this.products = Array.from({ length: 7 }).map((_, i) => `Item #${i}`);

        this.userSubscription = this.AuthService.user.subscribe(user => {
            this.userName = user ? user.username : null;
            this.userID = user ? user.user_id : '';
        });        

        this.subscriptions.add(
            this.AppComponent.isNightMode.subscribe(response => {
                this.isnightMode = response;
            })
        )

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--indigo-500'),
                    borderColor: documentStyle.getPropertyValue('--indigo-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: [49, 20, 60, 50, 86, 27, 60]
                }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }

            }
        };

        const documentStyle2 = getComputedStyle(document.documentElement);
        const textColor2 = documentStyle.getPropertyValue('--text-color');

        this.data2 = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle2.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle2.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.options2 = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor2
                    }
                }
            }
        };
        
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }

        this.subscriptions.unsubscribe();
    }

    getRawMaterial() {
        this.rawmatsLoading = true;

        this.subscriptions.add(
            this.RawMaterialService.getRawMatsData().subscribe(
                response => {
                    this.rawmatsLoading = false;
                    this.rawMaterial = response;
                }, err => {
                    console.error(err);
                    this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'There was an error fetching raw material' });
                }
            )
        )
    }

    getRecentBinload() {
        // this.subscriptions.add(
        //     this.BinloadService.getRecentBinload().subscribe(
        //         response => {
        //             this.recentBinload = response;
        //         }, err => {
        //             console.error(err)
        //         }
        //     )
        // )

        this.unloadLoading = true;

        this.subscriptions.add(
            this.BinloadService
            .getRecentBinload()
            .subscribe(
                response => {
                this.recentBinload = response;
                this.unloadLoading = false;
            })
        )
    }

    getWarehouseLocation() {
        this.cardsLoading = true;

        this.subscriptions.add(
            this.WarehouseLocationService.getWarehouseLocationData().subscribe(
                response => {
                    this.cardsLoading = false;
                    this.warehouseLocation = response;
                }, err => {
                    console.log('err: ' + err);
                }
            )
        )
    }

    getLandedShipping() {
        this.receivedLoading = true;

        this.subscriptions.add(
            this.ContractPerformaService.getReceived(0).subscribe(
                response => {
                    this.receivedLoading = false;
                    this.landedShipping = response.splice(0);
                }
            )
        )
    }

    getUnloadingTransaction() {
        this.unloadLoading = true;

        this.subscriptions.add(
            this.UnloadingService.filterUnloadingTransaction(1).subscribe(
                response => {
                    this.unloading = response.splice(-5);
                    // response.forEach((item: any) => {
                    //     if (new Date(item.DateUnload.date).toDateString() == new Date().toDateString()) {
                    //         this.unloading.push(item);
                    //     }
                    // })

                    this.unloadLoading = false;

                }
            )
        )
    }

    getRecentTransfer() {

        this.transferLoading = true;

        this.subscriptions.add(
            this.RawMaterialTransferService.getRecentTransfer().subscribe(
                response => {
                    this.transferLoading = false;

                    this.recentTransfer = response.map((item: any) => {
                        return {
                            ...item,
                            events: [
                                {
                                    status: 'Time Out',
                                    date: item.FeedmixDeparture
                                },
                                {
                                    status: 'Source Arrival',
                                    date: item.SourceArrival
                                },
                                {
                                    status: 'Source Departure',
                                    date: item.SourceDeparture
                                },
                                {
                                    status: 'Time In',
                                    date: item.FeedmixArrival
                                }
                            ]
                        };
                    });

                    // console.log(this.recentTransfer)

                }
            )
        )

    }

    toggleWideScreen() {
        this.AppComponent.onToggleWideScreen();
    }

    getClass(i: number) {

        if (i == 0) {
            return 'bg-blue-100 text-blue-600';
        } else if ( i == 1) {
            return 'bg-yellow-100 text-yellow-600'
        } else if (i == 2) {
            return 'bg-green-100 text-green-600'
        } else if (i == 3) {
            return 'bg-indigo-100 text-indigo-600'
        }

        return ''
    }

    getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
        if (requestWeight === 0) return 0; // Avoid division by zero
        const percentage = (served / requestWeight) * 100;
        // return Number(percentage.toFixed(2)); 

        return Math.round(percentage);
    }

    vsYesterday(row: any) {

        if (row.YesterdayWeight === 0 ) return Number(0);

        let netWeight = row.TotalWeight - row.YesterdayWeight;

        let percentage = (netWeight / row.YesterdayWeight) * 100;

        return Number(percentage.toFixed(2));
    }

    counterEffect() {
        
    }

}