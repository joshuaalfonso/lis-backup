




import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";



@Injectable({providedIn: 'root'})
export class RawMaterialStandardService {

    baseUrl = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ){}

    getRawMaterialStandard() {
        return this.http.get<any>( this.baseUrl + '/project/lab/a_RawMaterialList.php')
    }

    setParams(data: any) {
        return this.http.post<any>( this.baseUrl + 'project/lab/b_SetParameters.php', data )
    }

    // getData() {
    //     return this.http.get<any>( this.baseUrl + '/project/a_bank.php');
    // }

}