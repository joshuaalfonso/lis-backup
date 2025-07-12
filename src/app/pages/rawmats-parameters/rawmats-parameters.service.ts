
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";



@Injectable({providedIn: 'root'})
export class RawMatsParametersService {

    baseUrl = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ){}

    getRawMatsParams() {
        return this.http.get<any>( this.baseUrl + '/project/a')
    }

    // getData() {
    //     return this.http.get<any>( this.baseUrl + '/project/a_bank.php');
    // }

}