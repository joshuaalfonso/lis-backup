import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';


// Import PrimeNG modules
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthComponent } from './auth/auth.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppRoutingModule } from './app.routing';
import { RawMaterialsComponent } from './raw-materials/raw-materials.component';
import { ConfirmationService } from 'primeng/api';
import { BrokerComponent } from './pages/broker/broker.component';
import { CheckerComponent } from './checker/checker.component';
import { TruckTypeComponent } from './truck-type/truck-type.component';
import { ModuleComponent } from './module/module.component';
import { TransferComponent } from './raw-material-transfer/transfer.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { TruckingComponent } from './pages/trucking/trucking.component';
import { FinishProductComponent } from './finish-product/finish-product.component';
import { FinishProductInventory } from './finish-product-inventory/finish-product-inventory.component';
import { FinishProductTrasfer } from './finish-product-transfer/finish-product-transfer.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CustomerComponent } from './cutomer/customer.component';
import { SalesAgentComponent } from './sales-agent/sales-agent.component';
import { ContainerTypeComponent } from './pages/container-type/container-type.component';
import { ContractPerformaComponent } from './contract-performa/contract-performa.component';
import { DriverComponent } from './pages/driver/driver.component';
import { IndentorComponent } from './indentor/indentor.component';
import { WeighingTransactionComponent } from './weighing-transaction/weighing.component';
import { ProductionOutputComponent } from './production-output/production-output.component';
import { ShippingTransaction } from './shipping-transaction/shipping-transaction.component';
import { ShippingDocumentComponent } from './shipping-document/shipping-document.component';
import { WeighingTransactionDetailsComponent } from './weighing-transaction-details/weighing-transaction-details.component';
import { UnloadingTransactionComponent } from './unloading-transaction/unloading-transaction.component';
import { AddDeliveryComponent } from './delivery-add/add-delivery.component';
import { BinloadingComponent } from './binload/binload.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { CheckerType } from './checker-type/checker-type.component';
import { WeigherComponent } from './weigher/weigher.component';
import { WarehouseInventoryComponent } from './rm-warehouse-inventory/warehouse-inventory.component';
import { BankComponent } from './pages/bank/bank.component';
import { RawMatsPOComponent } from './rawmats-po/rawmats-po.component';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { GuardComponent } from './guard/guard.component';
import { CheckerScheduleComponent } from './checker-schedule/checker-schedule.component';
import { CardsLocationComponent } from './cards-location/cards-location.component';
import { CardsLocationLoaderComponent } from './cards-location-loader/cards-location-loader.component';
import { CardsTransferComponent } from './cards-transfer/cards-transfer.component';
import { CardsTransferLoaderComponent } from './cards-transfer-loader/cards-transfer-loader.component';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { SecurityComponent } from './features/profile-settings/security/security.component';
import { AccountDetailsComponent } from './features/profile-settings/account-details/account-details.component';
import { DispatcherDashboardComponent } from './features/dashboard/dispatcher-dashboard/dispatcher-dashboard.component';
import { SubmitButtonComponent } from './submit-button/submit-button.component';
import { DashboardWarehousingComponent } from './dashboard-warehousing/dashboard-warehousing.component';
import { DashboardReceivedComponent } from './features/dashboard/dashboard-received/dashboard-received.component';
import { DashboardRawmatsComponent } from './features/dashboard/dashboard-rawmats/dashboard-rawmats.component';
import { DashbTableLoaderComponent } from './dashb-table-loader/dashb-table-loader.component';
import { ImportationDashboardComponent } from './features/dashboard/importation-dashboard/importation-dashboard.component';
import { RawmatsInspectionComponent } from './lab/rawmats-inspection/rawmats-inspection.component';
import { RawmatsInspectionFormComponent } from './lab/rawmats-inspection/ui/rawmats-inspection-form/rawmats-inspection-form.component';
import { RawmatsInspectionTableComponent } from './lab/rawmats-inspection/ui/rawmats-inspection-table/rawmats-inspection-table.component';
import { RawMaterialsModalComponent } from './raw-materials/ui/raw-materials-modal/raw-materials-modal.component';
import { RawMaterialsTableComponent } from './raw-materials/ui/raw-materials-table/raw-materials-table.component';
import { BinloadVerifiedTableComponent } from './binload/ui/binload-verified-table/binload-verified-table.component';
import { BinloadTableComponent } from './binload/ui/binload-table/binload-table.component';
import { RawmatsPoTableComponent } from './rawmats-po/ui/rawmats-po-table/rawmats-po-table.component';
import { RawmatsPoModalComponent } from './rawmats-po/ui/rawmats-po-modal/rawmats-po-modal.component';
import { RawmatsPoCompletedComponent } from './rawmats-po/ui/rawmats-po-completed/rawmats-po-completed.component';
import { SystemLogsComponent } from './pages/system-logs/system-logs.component';
import { AuthInterceptorService } from './auth/auth.interceptor.service';
import { UnloadingDetailComponent } from './unloading-detail/unloading-detail.component';
import { TransferDetailComponent } from './transfer-detail/transfer-detail.component';
import { WarehouseStockTableComponent } from './binload/ui/warehouse-stock-table/warehouse-stock-table.component';
import { AddRequestComponent } from './binload/ui/add-request/add-request.component';
import { VerifyRequestComponent } from './binload/ui/verify-request/verify-request.component';
import { StockingComponent } from './pages/stocking/stocking.component';
import { LocalSupplier } from './pages/supplier-local/local-supplier.component';
import { RawMaterialInventoryComponent } from './pages/raw-material-inventory/raw-material-inventory.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { WarehouseComponent } from './pages/warehouse/warehouse.component';
import { WarehouseLocationComponent } from './pages/warehouse-location/warehouse-location.component';
import { WarehousePartition } from './pages/warehouse-partition/warehouse-partition.component';
import { ShippingLineComponent } from './pages/shipping-line/shipping-line.component';
import { TruckComponent } from './pages/truck/truck.component';
import { PlantComponent } from './pages/plant/plant.component';
import { PortOfDischarge } from './pages/port-of-discharge/port-of-discharge.component';
import { DashboardRecentTransferComponent } from './features/dashboard/dashboard-recent-transfer/dashboard-recent-transfer.component';
import { DashboardRecentUnloadComponent } from './features/dashboard/dashboard-recent-unload/dashboard-recent-unload.component';
import { DashboardRecentBinloadComponent } from './features/dashboard/dashboard-recent-binload/dashboard-recent-binload.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TabComponent } from './components/tab/tab.component';
import { UsersComponent } from './pages/users/users.component';
import { UnloadingComponent } from './pages/unloading/unloading.component';
import { LocalTableComponent } from './features/unloading/local-table/local-table.component';
import { CreateUnloadingComponent } from './features/unloading/create-unloading/create-unloading.component';
import { ImportationComponent } from './pages/importation/importation.component';
import { ActiveContractTableComponent } from './features/importation/active-contract-table/active-contract-table.component';
import { ActiveContractDialogComponent } from './features/importation/active-contract-dialog/active-contract-dialog.component';
import { CompletedContractTableComponent } from './features/importation/completed-contract-table/completed-contract-table.component';
import { SailingTableComponent } from './features/importation/sailing-table/sailing-table.component';
import { LandedTableComponent } from './features/importation/landed-table/landed-table.component';
import { CreateShippingTransactionComponent } from './features/importation/create-shipping-transaction/create-shipping-transaction.component';
import { SailingToLandedComponent } from './features/importation/sailing-to-landed/sailing-to-landed.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SidebarComponent,
    TopBarComponent,
    DashboardComponent,
    RawMaterialsComponent,
    RawMaterialInventoryComponent,
    TransferComponent,
    SupplierComponent,
    BrokerComponent,
    WarehouseComponent,
    WarehouseLocationComponent,
    WarehousePartition,
    CheckerComponent,
    ShippingLineComponent,
    ModuleComponent,
    TruckComponent,
    TruckingComponent,
    TruckTypeComponent,
    PlantComponent,
    DeliveryComponent,
    AddDeliveryComponent,
    DeliveryDetailComponent,
    FinishProductComponent,
    FinishProductInventory,
    FinishProductTrasfer,
    LoaderComponent,
    CustomerComponent,
    SalesAgentComponent,
    ContainerTypeComponent,
    ContractPerformaComponent,
    DriverComponent,
    IndentorComponent,
    WeighingTransactionComponent,
    WeighingTransactionDetailsComponent,
    ProductionOutputComponent,
    ShippingTransaction,
    ShippingDocumentComponent,
    UnloadingTransactionComponent,
    BinloadingComponent,
    DispatcherComponent,
    CheckerType,
    WeigherComponent,
    WarehouseInventoryComponent,
    BankComponent,
    RawMatsPOComponent,
    PortOfDischarge,
    ContentHeaderComponent,
    UsersComponent,
    UnauthorizedComponent,
    GuardComponent,
    CheckerScheduleComponent,
    CardsLocationComponent,
    CardsLocationLoaderComponent,
    CardsTransferComponent,
    CardsTransferLoaderComponent,
    ProfileSettingsComponent,
    SecurityComponent,
    AccountDetailsComponent,
    DispatcherDashboardComponent,
    SubmitButtonComponent,
    RawMaterialsModalComponent, 
    DashboardWarehousingComponent,
    TabComponent,
    DashboardRecentUnloadComponent,
    DashboardRecentBinloadComponent,
    DashboardRecentTransferComponent,
    DashboardReceivedComponent,
    DashboardRawmatsComponent,
    DashbTableLoaderComponent,
    ImportationDashboardComponent,
    RawmatsInspectionComponent,
    RawmatsInspectionFormComponent,
    RawmatsInspectionTableComponent,
    RawMaterialsTableComponent,
    LocalSupplier,
    BinloadVerifiedTableComponent,
    BinloadTableComponent,
    RawmatsPoTableComponent,
    RawmatsPoModalComponent,
    RawmatsPoCompletedComponent,
    SystemLogsComponent,
    UnloadingDetailComponent,
    TransferDetailComponent,
    WarehouseStockTableComponent,
    AddRequestComponent,
    VerifyRequestComponent,
    StockingComponent,
    UnloadingComponent,
    LocalTableComponent,
    CreateUnloadingComponent,
    ImportationComponent,
    ActiveContractTableComponent,
    ActiveContractDialogComponent,
    CompletedContractTableComponent,
    SailingTableComponent,
    LandedTableComponent,
    CreateShippingTransactionComponent,
    SailingToLandedComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AvatarModule,
    AvatarGroupModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BadgeModule,
    BreadcrumbModule,
    BlockUIModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    CascadeSelectModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    ChipModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ContextMenuModule,
    VirtualScrollerModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DockModule,
    DragDropModule,
    DropdownModule,
    DynamicDialogModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    ImageModule,
    KnobModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrganizationChartModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    SelectButtonModule,
    SidebarModule,
    ScrollerModule,
    ScrollPanelModule,
    ScrollTopModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SpeedDialModule,
    SpinnerModule,
    SplitterModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TagModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TriStateCheckboxModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    AnimateModule,
    CardModule,
    RippleModule
  ],
  providers: [ConfirmationService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
// , {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
