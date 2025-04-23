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
              view: false,
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
                    view: false,
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
                            view: false,
                        },
                        {
                            title: 'Warehouse',
                            routerLink: '/warehouse',
                            view: false,
                        },
                        {
                            title: 'Partition',
                            routerLink: '/warehouse-partition',
                            view: false,
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
                            view: false,
                        },
                        // {
                        //     title: 'Finish Product',
                        //     routerLink: '/finish-product-inventory',
                        //     view: true,
                        // },
                        {
                            title: 'Warehouse',
                            routerLink: '/warehouse-inventory',
                            view: false,
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
                            view: false,
                        },
                        {
                            title: 'Trucking',
                            routerLink: '/trucking',
                            view: false,
                        },
                        // {
                        //     title: 'Truck Type',
                        //     routerLink: '/truck-type',
                        //     view: true,
                        // },
                        {
                            title: 'Driver',
                            routerLink: '/driver',
                            view: false,
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
                            view: false,
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
                            view: false,
                        },
                    ]
                },
               
                {
                    title: 'Supplier',
                    icon: 'assets/icons/icon-flatbed.svg',
                    // routerLink: '/supplier',
                    isCollapse: false,
                    view: true,
                    subMenu: [
                        {
                            title: 'Import',
                            routerLink: '/supplier',
                            view: false,
                        },
                        {
                            title: 'Local',
                            routerLink: '/local-supplier',
                            view: false,
                        }
                    ]
                },
                // {
                //     title: 'Supplier',
                //     icon: 'assets/icons/icon-flatbed.svg',
                //     isCollapse: false,
                //     view: true,
                //     subMenu: [
                //         {
                //             title: 'Supplier',
                //             routerLink: '/supplier',
                //             view: false,
                //         },
                //         // {
                //         //     title: 'Checker Type',
                //         //     routerLink: '/checker-type',
                //         //     view: true,
                //         //     insert: true,
                //         //     edit: true
                //         // },
                //         {
                //             title: 'Checker Schedule',
                //             routerLink: '/checker-schedule',
                //             view: false,
                //         },
                //     ]
                // },

              ],
            },
            {
                title: 'Transactions',
                view: false,
                subMenu: [
                    {
                        title: 'Raw Mats PO',
                        icon: 'assets/icons/icon-user-bag.svg',
                        routerLink: '/contract-po',
                        isCollapse: false,
                        view: false,
                    },
                    {
                        title: 'Importation',
                        icon: 'assets/icons/icon-ship.svg',
                        routerLink: '/contract-performa',
                        isCollapse: false,
                        view: false,
                    },
                    {
                        title: 'Unloading',
                        icon: 'assets/icons/icon-truck-unload.svg',
                        routerLink: '/unloading-transaction',
                        isCollapse: false,
                        view: false,
                    },
                    {
                        title: 'Binloading',
                        icon: 'assets/icons/icon-truck-binload.svg',
                        routerLink: '/binload',
                        isCollapse: false,
                        view: false,
                    },
                    {
                        title: 'Transfer',
                        icon: 'assets/icons/icon-transfer.svg',
                        routerLink: '/transfer',
                        view: false,
                    },
                    {
                        title: 'Inspection',
                        icon: 'assets/icons/icon-microscope.svg',
                        routerLink: '/rawmats-inspection',
                        view: false,
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
                                view: false,
                            },
                            {
                                title: 'Module',
                                routerLink: '/module',
                                view: false,
                            },
                        ]
                    },
                    {
                        title: 'Legal',
                        icon: 'assets/icons/icon-legal-case.svg',
                        isCollapse: false,
                        view: true,
                        subMenu: [ 
                            {
                                title: 'Shipping Line',
                                routerLink: '/shipping-line',
                                view: false,
                            },
                            {
                                title: 'Port of Discharge',
                                routerLink: '/port-of-discharge',
                                view: false,
                            },
                            {
                                title: 'Bank',
                                routerLink: '/bank',
                                view: false,
                            },
                            {
                                title: 'Broker',
                                routerLink: '/broker',
                                view: false,
                            },
                            {
                                title: 'Container Type',
                                routerLink: '/container-type',
                                view: false,
                            },
                        ]
                    },
                    {
                        title: 'System Logs',
                        icon: 'assets/icons/icon-logs.svg',
                        routerLink: '/system-logs',
                        view: false,
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


        this.BinloadService.binloadNotVerified.subscribe(
            response => {
                this.binloadUnverified = response;
            }
        )

    }

    allSubMenuItemsHidden(item: any) {
        return item.subMenu && item.subMenu.every((subItem: any) => !subItem.view);
    }


    getUserAccess(UserID: string) {
        this.SidebarService.getUserAccessRequest(UserID).subscribe(
            response => {
                this.userAccessRights = response;

                this.userAccessRights.forEach(accessRight => {
                    switch(accessRight.AccessRight.trim()) {
                        case '2' :
                            this.menus[1].view = true;
                            break
                        case '2.1.1' :
                            this.menus[1].subMenu[0].view = true;
                            break
                        case '2.2.1' :
                            this.menus[1].subMenu[1].subMenu[0].view = true;
                            break
                        case '2.3.1' :
                            this.menus[1].subMenu[1].subMenu[1].view = true;
                            break
                        case '2.4.1' :
                            this.menus[1].subMenu[1].subMenu[2].view = true;
                            break
                        case '2.5.1' :
                            this.menus[1].subMenu[2].subMenu[0].view = true;
                            break
                        case '2.6.1' :
                            this.menus[1].subMenu[2].subMenu[1].view = true;
                            break
                        case '2.9.1' :
                            this.menus[1].subMenu[3].subMenu[0].view = true;
                            break
                        case '2.10.1' :
                            this.menus[1].subMenu[3].subMenu[1].view = true;
                            break
                        case '2.11.1' :
                            this.menus[1].subMenu[3].subMenu[2].view = true;
                            break
                        case '2.12.1' :
                            this.menus[1].subMenu[4].subMenu[0].view = true;
                            break
                        case '2.13.1' :
                            this.menus[1].subMenu[4].subMenu[1].view = true;
                            break
                        case '2.14.1' :
                            this.menus[1].subMenu[5].subMenu[0].view = true;
                            break
                        case '2.15.1' :
                            this.menus[1].subMenu[5].subMenu[1].view = true;
                            break
                        case '3' :
                            this.menus[2].view = true;
                            break
                        case '3.1.1' :
                            this.menus[2].subMenu[0].view = true;
                            break
                        case '3.2.1' :
                            this.menus[2].subMenu[1].view = true;
                            break
                        case '3.3.1' :
                            this.menus[2].subMenu[2].view = true;
                            break
                        case '3.4.1' :
                            this.menus[2].subMenu[3].view = true;
                            break
                        case '3.5.1' :
                            this.menus[2].subMenu[4].view = true;
                            break
                        case '3.6.1' :
                            this.menus[2].subMenu[5].view = true;
                            break
                        case '4.1.1' :
                            this.menus[3].subMenu[0].subMenu[0].view = true;
                            break
                        case '4.2.1' :
                            this.menus[3].subMenu[0].subMenu[1].view = true;
                            break
                        case '4.3.1' :
                            this.menus[3].subMenu[1].subMenu[0].view = true;
                            break
                        case '4.4.1' :
                            this.menus[3].subMenu[1].subMenu[1].view = true;
                            break
                        case '4.5.1' :
                            this.menus[3].subMenu[1].subMenu[2].view = true;
                            break
                        case '4.6.1' :
                            this.menus[3].subMenu[1].subMenu[3].view = true;
                            break
                        case '4.7.1' :
                            this.menus[3].subMenu[1].subMenu[4].view = true;
                            break
                        case '4' :
                            this.menus[3].view = true;
                            break;
                        case '5.1' :
                            this.menus[3].subMenu[2].view = true;
                            break;
                        default:
                            break;
                    }
                })

             

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