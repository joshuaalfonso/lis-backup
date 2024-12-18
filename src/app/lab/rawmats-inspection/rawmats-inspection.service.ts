import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";





@Injectable({
    providedIn: 'root'
})
export class RawMatsInspectionService {

    baseUrl: string = environment.backend.baseURL;
    apiUrl = '10.10.2.110';

    constructor(
        private http: HttpClient
    ) {}

    getRawMatsStandard(id: number) {
        return this.http.get<any>( this.baseUrl + '/project/lab/a_Inspection.php?RawMatsID=' + id);
    }

}