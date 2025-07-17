import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";






@Injectable({providedIn: 'root'})
export class InventoryReportService {

    baseUrl = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ){}
    
    getRawMaterialInventoryReport(dataFrom: string, dateTo: string) {
        return this.http.get<any>( 
            this.baseUrl + '/project/report/a_RawMaterialInventoryReport.php',
            {
                params: {
                    dateFrom: dataFrom,
                    dateTo: dateTo
                }
            } 
        );
    }

}