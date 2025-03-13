import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";


@Injectable({providedIn: 'root'})
export class WarehouseInventoryService {
    
    constructor( private http: HttpClient){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;

    // baseUrl: string = environment.backend.baseURL;
    // apiUrl = '10.10.2.110';

    getWarehouseInventoryData() {
        return this.http.get<any>( this.baseUrl + '/project/a_WarehouseInventory(RM).php');
    }

    getFpWarehouseInventoryData() {
        return this.http.get<any>( this.baseUrl + '/project/a_WarehouseInventory(FP).php');
    }
}