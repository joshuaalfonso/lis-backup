import { Component, Input, OnInit } from "@angular/core";
import { AppComponent } from "../app.component";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ModuleService } from "../module/module.service";


@Component({
    selector: 'app-content-header',
    templateUrl: 'content-header.component.html',
    styleUrls: ['content-header.component.css']
})
export class ContentHeaderComponent implements OnInit {

    @Input() title?: string;

    subscription: Subscription = new Subscription;

    user: any;

    module: any[] = [];

    isNightMode!: boolean;

    sidebarVisible: boolean = false;

    constructor
    (
        private AppComponent: AppComponent,
        private AuthService: AuthService,
        private ModuleService: ModuleService
    ) {}

    ngOnInit(): void {

        this.getUser();
        this.getModule();

        this.getUserModule();

        this.subscription.add(
            this.AppComponent.isNightMode.subscribe(
                response => {
                    this.isNightMode = response;
                }
            )
        )
        
    }

    getUser() {
        this.subscription.add(
            this.AuthService.user.subscribe(
                user => {
                    // console.log(user);
                    this.user = user || 'null';
                }
            )
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

    toggleWideScreen() {
        this.AppComponent.onToggleWideScreen();
    }

    toggleNightModle() {
        this.AppComponent.onToggleNightmode();
    }

    toggleMobileSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
    }

    transform(value: string): string {
        return value ? value.charAt(0) : '';
    }

    getUserModule() {
        let usermoduleValue = '';

        this.module.forEach(item => {
            if (item.ModuleID ===  this.user.usl) {
                return usermoduleValue = item.ModuleName;
            }
        })

        return usermoduleValue;
        
    }

}