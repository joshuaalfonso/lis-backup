import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";
import { RawMaterialPackagingList } from "./raw-material-packaging.model";






@Injectable({providedIn: 'root'})
export class RawMaterialPackagingService {

    private baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    rawMaterialPackagingList() {
        return this.http.get<RawMaterialPackagingList[]>( `${this.baseUrl}/project/a_RawMaterialPackaging.php` )
    }

}
