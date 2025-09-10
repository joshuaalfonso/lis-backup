import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";




@Injectable({providedIn: 'root'})
export class RawMaterialCategoryService {

    private baseUrl = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    rawMaterialCategoryList() {
        return this.http.get<any>( `${this.baseUrl}/project/a_RawMaterialCategory.php` )
    }

}