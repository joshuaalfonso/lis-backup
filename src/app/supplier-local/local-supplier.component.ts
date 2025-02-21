import { Component, OnInit } from '@angular/core'
import { SupplierService } from '../supplier/supplier.service';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-local-supplier',
    templateUrl: 'local-supplier.component.html',
    styleUrls: ['local-supplier.component.css']
})

export class LocalSupplier implements OnInit {

    
    localSupplier: any[] = [];
    isLoading: boolean = false;

    subscriptions: Subscription = new Subscription;
 
    constructor(
        private SupplierService: SupplierService
    ) {}


    ngOnInit(): void {
        
        this.getLocalSupplier();

    }

    getLocalSupplier() {
        this.isLoading = false;

        this.subscriptions.add(
            this.SupplierService.getLocalSupplier().subscribe(
                response => {
                    this.localSupplier = response;
                }, error => {
                    console.log(error);
                    
                }
            )
        )

    }

}