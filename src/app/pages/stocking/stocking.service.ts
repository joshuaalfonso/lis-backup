import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";







@Injectable({providedIn: 'root'})
export class StockingService {

    baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    getStocking() {
        return this.http.get<any>( this.baseUrl + '/project/a_WarehousePartitionStock' );
    }

}