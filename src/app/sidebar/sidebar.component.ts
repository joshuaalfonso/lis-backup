import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { SidebarService } from "./sidebar.service";
import { BinloadService } from "../binload/binload.service";
import { AppComponent } from "../app.component";
import { ModuleService } from "../module/module.service";
import { AvatarService } from "src/assets/avatar/avatar.service";


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit, OnDestroy{

    sideBar: boolean = false;
    rawMatsSubMenu: boolean = false; 
    finishProdSubMenu: boolean = false;
    truckSubMenu: boolean = false;
    warehouseSubMenu: boolean = false;
    weighingSubMenu: boolean = false;
    checkerSubMenu: boolean = false;
    RawMats: boolean = false;
    legal: boolean = false;
    transferSubMenu: boolean = false;
    UsersSubMenu: boolean = false;
    
    user: any; 
    isAuthenticated = false;

    userAccessRights: any[] = [];

    module: any[] = [];

    RawMatView: boolean = false;
    FinishProductView: boolean = false;
    RawMatInventoryView: boolean = false;
    FinishProductInventoryView: boolean = false;
    WarehouseNameView: boolean = false;
    WarehouseLocationView: boolean = false;
    WarehousePartitionView: boolean = false;
    RawMatsPOView: boolean = false;
    ContractPerformaView: boolean = false;
    UnloadingView: boolean = false;
    BinloadView: boolean = false;
    RawMatsTransferView: boolean = false;
    FinishProductTransferView: boolean = false;
    ProductionOutputView: boolean = false;
    DeliveryScheduleView: boolean = false;
    DeliveryView: boolean = false;
    ProfileView: boolean = false;

    binloadUnverified!: number;


    menus: any[] = [];


    private userSub?: Subscription;

    private subscription: Subscription = new Subscription;


    avatarList: any[] = [];

    constructor(
        private AuthService: AuthService,
        private SidebarService: SidebarService,
        private BinloadService: BinloadService,
        private AppComponent: AppComponent,
        private ModuleService: ModuleService,
        private AvatarService: AvatarService
    ) {}

    ngOnInit(): void {

        this.avatarList = this.AvatarService.getAvatar();

        this.menus = [
            {
              title: 'Main',
              view: true,
              subMenu: [
                {
                  title: 'Dashboard',
                  icon: 'assets/icons/icon-grid.svg',
                  routerLink: '/dashboard',
                  view: true
                },
              ],
            },
            {
              title: 'Master',
              view: true,
              subMenu: [
                // {
                //     title: 'Products',
                //     icon: 'assets/icons/icon-tags.svg',
                //     isCollapse: false,
                //     view: true,
                //     subMenu: [
                //     {
                //         title: 'Raw Material',
                //         routerLink: '/raw-materials',
                //         view: false,
                //         insert: false,
                //         edit: false
                //     },
                //     {
                //         title: 'Finish Product',
                //         routerLink: '/finish-product',
                //         view: false,
                //         insert: false,
                //         edit: false
                //     },
                //     ],
                // },
                {
                    title: 'Raw Material',
                    icon: 'assets/icons/icon-tags.svg',
                    routerLink: '/raw-materials',
                    view: true,
                },

                {
                    title: 'Warehouse',
                    icon: 'assets/icons/icon-warehouse-alt.svg',
                    isCollapse: false,
                    view: true,
                    subMenu: [
                        {
                            title: 'Location',
                            routerLink: '/warehouse-location',
                            view: true,
                        },
                        {
                            title: 'Warehouse',
                            routerLink: '/warehouse',
                            view: true,
                        },
                        {
                            title: 'Partition',
                            routerLink: '/warehouse-partition',
                            view: true,
                        },
                    ],
                },

                
                
                {
                    title: 'Inventory',
                    icon: 'assets/icons/icon-inventory2.svg',
                    isCollapse: false,
                    view: true,
                    subMenu: [
                        {
                            title: 'Raw Material',
                            routerLink: '/inventory',
                            view: true,
                        },
                        // {
                        //     title: 'Finish Product',
                        //     routerLink: '/finish-product-inventory',
                        //     view: true,
                        // },
                        {
                            title: 'Warehouse',
                            routerLink: '/warehouse-inventory',
                            view: true,
                        },
                    ],
                },

                {
                    title: 'Transportation',
                    icon: 'assets/icons/icon-truck-container.svg',
                    isCollapse: false,
                    view: true,
                    subMenu: [
                        {
                            title: 'Truck',
                            routerLink: '/truck',
                            view: true,
                        },
                        {
                            title: 'Trucking',
                            routerLink: '/trucking',
                            view: true,
                        },
                        // {
                        //     title: 'Truck Type',
                        //     routerLink: '/truck-type',
                        //     view: true,
                        // },
                        {
                            title: 'Driver',
                            routerLink: '/driver',
                            view: true,
                        },
                    ],
                },

                {
                    title: 'Checker',
                    icon: 'assets/icons/icon-user-check.svg',
                    isCollapse: false,
                    view: true,
                    subMenu: [
                        {
                            title: 'Checker',
                            routerLink: '/checker',
                            view: true,
                            insert: true,
                            edit: true
                        },
                        // {
                        //     title: 'Checker Type',
                        //     routerLink: '/checker-type',
                        //     view: true,
                        //     insert: true,
                        //     edit: true
                        // },
                        {
                            title: 'Checker Schedule',
                            routerLink: '/checker-schedule',
                            view: true,
                            insert: true,
                            edit: true
                        },
                    ]
                },
               
                {
                    title: 'Supplier',
                    icon: 'assets/icons/icon-flatbed.svg',
                    routerLink: '/supplier',
                    view: true,
                }

              ],
            },
            {
                title: 'Transactions',
                view: true,
                subMenu: [
                    {
                        title: 'Raw Mats PO',
                        icon: 'assets/icons/icon-user-bag.svg',
                        routerLink: '/contract-po',
                        isCollapse: false,
                        view: true,
                    },
                    {
                        title: 'Importation',
                        icon: 'assets/icons/icon-ship.svg',
                        routerLink: '/contract-performa',
                        isCollapse: false,
                        view: true,
                    },
                    {
                        title: 'Unloading',
                        icon: 'assets/icons/icon-truck-unload.svg',
                        routerLink: '/unloading-transaction',
                        isCollapse: false,
                        view: true,
                    },
                    {
                        title: 'Binloading',
                        icon: 'assets/icons/icon-truck-binload.svg',
                        routerLink: '/binload',
                        isCollapse: false,
                        view: true,
                    },
                    {
                        title: 'Transfer',
                        icon: 'assets/icons/icon-transfer.svg',
                        routerLink: '/transfer',
                        view: true,
                    }
                ]
            }, 
            {
                title: 'Others',
                view: false,
                subMenu: [
                    {
                        title: 'Account',
                        icon: 'assets/icons/icon-user.svg',
                        isCollapse: false,
                        view: true,
                        subMenu: [  
                            {
                                title: 'Users',
                                routerLink: '/users',
                                view: true,
                                insert: true,
                                edit: true
                            },
                            {
                                title: 'Module',
                                routerLink: '/module',
                                view: true,
                                insert: true,
                                edit: true
                            },
                        ]
                    },
                    // {
                    //     title: 'Checker',
                    //     icon: 'assets/icons/icon-user-check.svg',
                    //     isCollapse: false,
                    //     view: true,
                    //     subMenu: [
                    //         {
                    //             title: 'Checker',
                    //             routerLink: '/checker',
                    //             view: true,
                    //             insert: true,
                    //             edit: true
                    //         },
                    //         {
                    //             title: 'Checker Type',
                    //             routerLink: '/checker-type',
                    //             view: true,
                    //             insert: true,
                    //             edit: true
                    //         },
                    //         {
                    //             title: 'Checker Schedule',
                    //             routerLink: '/checker-schedule',
                    //             view: true,
                    //             insert: true,
                    //             edit: true
                    //         },
                    //     ]
                    // },
                    // {
                    //     title: 'Dispatcher',
                    //     icon: 'assets/icons/icon-user-dispatch.svg',
                    //     routerLink: '/dispatcher',
                    //     view: true,
                    // },
                    {
                        title: 'Legal',
                        icon: 'assets/icons/icon-legal-case.svg',
                        isCollapse: false,
                        view: true,
                        subMenu: [ 
                            // {
                            //     title: 'Sales Agent',
                            //     routerLink: '/sales-agent',
                            //     view: true,
                            //     insert: true,
                            //     edit: true
                            // },
                            {
                                title: 'Shipping Line',
                                routerLink: '/shipping-line',
                                view: true,
                                insert: true,
                                edit: true
                            },
                            {
                                title: 'Port of Discharge',
                                routerLink: '/port-of-discharge',
                                view: true,
                                insert: true,
                                edit: true
                            },
                            {
                                title: 'Bank',
                                routerLink: '/bank',
                                view: true,
                                insert: true,
                                edit: true
                            },
                            {
                                title: 'Broker',
                                routerLink: '/broker',
                                view: true,
                                insert: true,
                                edit: true
                            },
                            {
                                title: 'Container Type',
                                routerLink: '/container-type',
                                view: true,
                                insert: true,
                                edit: true
                            },
                        ]
                    },
                ]
            }
        ];
        
        this.getModule();

        this.userSub = this.AuthService.user.subscribe(user => {
            this.isAuthenticated = !user ? false : true;
            if (this.isAuthenticated) {
                this.user = user;
                this.getUserAccess(this.user.user_id)
                // console.log(this.user)
            }
        });

        // this.BinloadService.getBinloadData(this.UserID).subscribe(
        //     response => {
        //         if (response) {
        //             // const unverified = response.length;

        //             const unverified = response.filter(
        //                 (item: any) => item.Status != 3
        //             );

                    
        //             this.BinloadService.binloadNotVerified.next(unverified.length);
        //         }
        //     }
        // )

        this.BinloadService.binloadNotVerified.subscribe(
            response => {
                this.binloadUnverified = response;
            }
        )

    }


    getUserAccess(UserID: string) {
        this.SidebarService.getUserAccessRequest(UserID).subscribe(
            response => {
                this.userAccessRights = response;

                // case 2.1:
                //     this.FinishProductView = true;
                //     this.menus[1].subMenu[0].subMenu[1].view = true;
                //     break

                // for (let i = 0; i < this.userAccessRights.length; i++) {
                //     switch (this.userAccessRights[i].AccessRight) {
                //         case 1.1:
                //             this.RawMatView = true;
                //             this.menus[1].subMenu[0].view = true;
                //             break
                //         case 3.1:
                //             this.RawMatInventoryView = true;
                //             this.menus[1].subMenu[1].subMenu[0].view = true;
                //             break
                //         case 4.1:
                //             this.FinishProductInventoryView = true;
                //             // this.menus[1].subMenu[1].subMenu[1].view = true;
                //             break; 
                //         case 5.1:
                //             this.WarehouseNameView = true;
                //             this.menus[1].subMenu[2].subMenu[1].view = true;
                //             break;
                //         case 6.1:
                //             this.WarehouseLocationView = true;
                //             this.menus[1].subMenu[2].subMenu[0].view = true;
                //             break;
                //         case 7.1:
                //             this.WarehousePartitionView = true;
                //             this.menus[1].subMenu[2].subMenu[2].view = true;
                //             break;
                //         case 21.1:
                //             this.RawMatsPOView = true;
                //             this.menus[2].subMenu[0].view = true;
                //             break;
                //         case 22.1:
                //             this.ContractPerformaView = true;
                //             this.menus[2].subMenu[1].view = true;
                //             break;
                //         case 23.1:
                //             this.UnloadingView = true;
                //             this.menus[2].subMenu[2].view = true;
                //             break;
                //         case 24.1:
                //             this.BinloadView = true;
                //             this.menus[2].subMenu[3].view = true;
                //             break;
                //         case 25.1:
                //             this.RawMatsTransferView = true;
                //             this.menus[2].subMenu[4].subMenu[0].view = true;
                //             break;
                //         case 26.1:
                //             this.FinishProductTransferView = true;
                //             this.menus[2].subMenu[4].subMenu[1].view = true;
                //             break;
                //         case 27.1:
                //             this.ProductionOutputView = true;
                //             break;
                //         case 28.1:
                //             this.DeliveryScheduleView = true;
                //             break;
                //         case 29.1:
                //             this.DeliveryView = true;
                //             break;
                //         case 50.1:
                //             this.ProfileView = true;
                //             break;
                //         default:
                //             break;
                //     }
                // }

            }
        )
    }

    getModule() {
        this.subscription.add(
            this.ModuleService.getModuleData().subscribe(
                response => {
                    this.module = response;
                }
            )
        )
    }

    getUserModule() {
        let usermoduleValue = '';

        this.module.forEach(item => {
            if (item.ModuleID ==  this.user?.usl) {
                return usermoduleValue = item.ModuleName;
            }
        })

        return usermoduleValue;
        
    }

    toggleNightMode() {
        this.AppComponent.onToggleNightmode();
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
    }
    

    toggleTopBar() {
        this.sideBar = !this.sideBar;
    }

    toggleRawMats() {
        this.rawMatsSubMenu = !this.rawMatsSubMenu;
    }

    toggleFinishProduct() {
        this.finishProdSubMenu = !this.finishProdSubMenu;
    }

    toggleTruck() {
        this.truckSubMenu = !this.truckSubMenu;
    }

    toggleWarehouse() {
        this.warehouseSubMenu = !this.warehouseSubMenu;
    }
    toggleWeighing() {
        this.weighingSubMenu = !this.weighingSubMenu;
    }

    toggleChecker() {
        this.checkerSubMenu = !this.checkerSubMenu;
    }

    toggleLegal() {
        this.legal = !this.legal;
    }

    toggleTransfer() {
        this.transferSubMenu = !this.transferSubMenu;
    }

    toggleUsers() {
        this.UsersSubMenu = !this.UsersSubMenu;
    }



    onLogout() {
        this.AuthService.logOut();
    }
}