import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";



@Injectable({providedIn: 'root'})
export class SystemLogsService {

    baseUrl: string = environment.backend.baseURL;

    constructor(
        private http: HttpClient
    ) {}

    getSystemLogs() {
        return this.http.get<any>( this.baseUrl + '/project/a_SystemLog.php' );
    }

    sytemLogView(data: any) {
        return this.http.post( this.baseUrl + '/project/b_SystemLogView.php', data );
    }

    filterDate(fromDate: string | null, toDate: string | null) {
        return this.http.post( this.baseUrl + '/project/b_SystemLogsFilter.php', {date: fromDate, date1: toDate})
    }


}