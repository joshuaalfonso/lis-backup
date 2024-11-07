import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "./auth/auth.guard";
import { RawMaterialsComponent } from "./raw-materials/raw-materials.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { BrokerComponent } from "./broker/broker.component";
import { WarehouseComponent } from "./warehouse/warehouse.component";
import { WarehouseLocationComponent } from "./warehouse-location/warehouse-location.component";
import { WarehousePartition } from "./warehouse-partition/warehouse-partition.component";
import { CheckerComponent } from "./checker/checker.component";
import { ShippingLineComponent } from "./shipping-line/shipping-line.component";
import { TruckTypeComponent } from "./truck-type/truck-type.component";
import { ModuleComponent } from "./module/module.component";
import { PlantComponent } from "./plant/plant.component";
import { RawMaterialInventoryComponent } from "./raw-material-inventory/raw-material-inventory.component";
import { TransferComponent } from "./raw-material-transfer/transfer.component";
import { DeliveryComponent } from "./delivery/delivery.component";
import { DeliveryDetailComponent } from "./delivery-detail/delivery-detail.component";
import { TruckingComponent } from "./trucking/trucking.component";
import { TruckComponent } from "./truck/truck.component";
import { FinishProductComponent } from "./finish-product/finish-product.component";
import { FinishProductInventory } from "./finish-product-inventory/finish-product-inventory.component";
import { FinishProductTrasfer } from "./finish-product-transfer/finish-product-transfer.component";
import { CustomerComponent } from "./cutomer/customer.component";
import { SalesAgentComponent } from "./sales-agent/sales-agent.component";
import { ContainerTypeComponent } from "./container-type/container-type.component";
import { ContractPerformaComponent } from "./contract-performa/contract-performa.component";
import { DriverComponent } from "./driver/driver.component";
import { IndentorComponent } from "./indentor/indentor.component";
import { WeighingTransactionComponent } from "./weighing-transaction/weighing.component";
import { ProductionOutputComponent } from "./production-output/production-output.component";
import { ShippingTransaction } from "./shipping-transaction/shipping-transaction.component";
import { ShippingDocumentComponent } from "./shipping-document/shipping-document.component";
import { WeighingTransactionDetailsComponent } from "./weighing-transaction-details/weighing-transaction-details.component";
import { UnloadingTransactionComponent } from "./unloading-transaction/unloading-transaction.component";
import { AddDeliveryComponent } from "./delivery-add/add-delivery.component";
import { DeliveryScheduleComponent } from "./delivery-schedule/delivery-schedule.component";
import { BinloadingComponent } from "./binload/binload.component";
import { DispatcherComponent } from "./dispatcher/dispatcher.component";
import { CheckerType } from "./checker-type/checker-type.component";
import { WeigherComponent } from "./weigher/weigher.component";
import { WarehouseInventoryComponent } from "./rm-warehouse-inventory/warehouse-inventory.component";
import { BankComponent } from "./bank/bank.component";
import { RawMatsPOComponent } from "./rawmats-po/rawmats-po.component";
import { PortOfDischarge } from "./port-of-discharge/port-of-discharge.component";
import { UsersComponent } from "./users/users.component";
import { HasRoleGuard } from "./auth/hasRole.guard";
import { UnauthorizedComponent } from "./unauthorized/unauthorized.component";
import { GuardComponent } from "./guard/guard.component";
import { CheckerScheduleComponent } from "./checker-schedule/checker-schedule.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { AccountDetailsComponent } from "./account-details/account-details.component";
import { SecurityComponent } from "./security/security.component";



const routes: Routes = [
    {
        path: '', 
        redirectTo: '/dashboard', 
        pathMatch: 'full'
    },
    {
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'raw-materials', 
        component: RawMaterialsComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '1.1.1'
        }
    },
    {
        path: 'finish-product', 
        component: FinishProductComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': 2.1
        }
    },
    {
        path: 'inventory', 
        component: RawMaterialInventoryComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '2.5.1'
        }
    },
    {
        path: 'finish-product-inventory', 
        component: FinishProductInventory, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': 4.1
        }
    },
    {
        path: 'warehouse', 
        component: WarehouseComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '2.3.1'
        }
    },
    {
        path: 'warehouse-location', 
        component: WarehouseLocationComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '2.2.1'
        }
    },
    {
        path: 'warehouse-partition', 
        component: WarehousePartition, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '2.4.1'
        }
    },
    {
        path: 'contract-po', 
        component: RawMatsPOComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '3.1.1'
        }
    },
    {
        path: 'contract-performa', 
        component: ContractPerformaComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '3.2.1'
        }
    },
    {
        path: 'unloading-transaction', 
        component: UnloadingTransactionComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '3.3.1'
        }
    },
    {
        path: 'binload', 
        component: BinloadingComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '3.4.1'
        }
    },
    {
        path: 'transfer', 
        component: TransferComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': '3.5.1'
        }
    },
    {
        path: 'finish-product-transfer', 
        component: FinishProductTrasfer, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': 26.1
        }
    },
    {
        path: 'production-output', 
        component: ProductionOutputComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': 27.1
        }
    },
    {
        path: 'delivery-schedule', 
        component: DeliveryScheduleComponent, 
        canActivate: [AuthGuard, HasRoleGuard], 
        data: {
            'role': 28.1
        }
    },
    {
        path: 'delivery', 
        component: DeliveryComponent, 
        canActivate: [AuthGuard, HasRoleGuard] , 
        data: {
            'role': 29.1
        }
    },
    {
        path: 'supplier', 
        component: SupplierComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '2.14.1'
        }
    },
    {
        path: 'broker', component: 
        BrokerComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.6.1'
        }
    },
    {
        path: 'warehouse-inventory', 
        component: WarehouseInventoryComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            role: '2.5.1'
        }
    },
    {
        path: 'checker', 
        component: CheckerComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '2.12.1'
        }
    },
    {
        path: 'guard', 
        component: GuardComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'shipping-line', 
        component: ShippingLineComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.3.1'
        }
    },
    {
        path: 'module', 
        component: ModuleComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.2.1'
        }
    },
    {
        path: 'truck', 
        component: TruckComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '2.9.1'
        }
    },
    {
        path: 'truck-type', 
        component: TruckTypeComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'trucking', 
        component: TruckingComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '2.10.1'
        }
    },
    {
        path: 'plant', 
        component: PlantComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'add-delivery', 
        component: AddDeliveryComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'delivery-detail', 
        component: DeliveryDetailComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'customer', 
        component: CustomerComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'sales-agent', 
        component: SalesAgentComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'container-type', 
        component: ContainerTypeComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.7.1'
        }
    },
    {
        path: 'driver', 
        component: DriverComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '2.10.1'
        }
    },
    {
        path: 'indentor', 
        component: IndentorComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'weighing-transaction', 
        component: WeighingTransactionComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'weighing-transaction-detail', 
        component: WeighingTransactionDetailsComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'shipping-transaction', 
        component: ShippingTransaction, 
        canActivate: [AuthGuard]
    },
    {
        path: 'shipping-document', 
        component: ShippingDocumentComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'dispatcher', 
        component: DispatcherComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'checker-type', 
        component: CheckerType, 
        canActivate: [AuthGuard]
    },
    {
        path: 'weigher', 
        component: WeigherComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'bank', 
        component: BankComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.5.1'
        }
    },
    {
        path: 'port-of-discharge', 
        component: PortOfDischarge, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.4.1'
        }
    },
    {
        path: 'users', 
        component: UsersComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '4.1.1'
        }
    },
    {
        path: 'checker-schedule', 
        component: CheckerScheduleComponent, 
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
            'role': '2.13.1'
        }
    },
    {
        path: 'unauthorized', 
        component: UnauthorizedComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'settings', 
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'account', 
                pathMatch: 'full' 
            },
            {
                path: 'account',
                component: AccountDetailsComponent
            },
            {
                path: 'security',
                component: SecurityComponent
            },
        ]
    },
    {
        path: 'login', 
        component: AuthComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule {}