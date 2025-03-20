import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";





@Injectable({
    providedIn: 'root'
})
export class RawMatsInspectionService {

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    getRawMatsStandard(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/lab/a_Inspection.php?RawMatsID=' + id);
    }

    createInspection(data: any) {
        return this.http.post<any>( this.baseUrl + '/project/lab/b_Inspection.php', data);
    }

    getInspectionList() {
        return this.http.get<any>( this.baseUrl + '/project/lab/a_InspectionReceipt.php' );
    }

    getParameterList() {
        return this.http.get<any>( this.baseUrl + '/project/lab/a_ParameterValue.php' );
    }

}