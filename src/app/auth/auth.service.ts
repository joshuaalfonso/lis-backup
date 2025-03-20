import { Injectable } from "@angular/core"
import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import { catchError, throwError, tap } from 'rxjs';
import { HttpHeaders } from "@angular/common/http";
import { User } from "./user.model";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";




@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private router: Router){}

    // parsedUrl = new URL(window.location.href);
    // baseUrl = this.parsedUrl.origin;

    baseUrl: string = environment.backend.baseURL;

    login(
        user_id: number,
        username: string,
        password: string,
    ) {
        return this.http.post(
            this.baseUrl + '/project/login.php',
            {
                UserID: user_id, 
                UName: username, 
                PWord: password,
            }
        ).pipe (
            catchError(this.handleError), tap( (resData: any) => {
                if (resData.data) {
                    // console.log(resData)
                    this.handleAuthentication(
                        resData.data.user_id, 
                        resData.data.username, 
                        resData.data.Avatar, 
                        resData.data.token, 
                        +resData.data.expiresIn, 
                        resData.data.usl, 
                        resData.data.AccessDetail
                    )
                }
            })
        )
    }

    private handleError(resData: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        return throwError(errorMessage);
    }

    private handleAuthentication(
        user_id: string,
        username: string,
        avatar: number,
        token: string,
        expiresIn: number,
        usl: string,
        accessDetail: any[]
    ) {
        const expirationDate = new Date ( new Date().getTime() + expiresIn * 1000 );
        const user = new User( user_id, username, avatar, token, expirationDate, usl, accessDetail);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('isNightMode', JSON.stringify(false));
    }

    autoLogin() {
        
        const userData: {
            user_id: string;
            username: string;
            avatar: number;
            _token: string;
            _tokenExpirationDate: string;
            usl: string;
            accessDetail: any[]
        } = JSON.parse(localStorage.getItem('userData')!);

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.user_id,
            userData.username, 
            userData.avatar, 
            userData._token, 
            new Date(userData._tokenExpirationDate),
            userData.usl,
            userData.accessDetail
            
        );
        
        if(loadedUser.token) {
            this.user.next(loadedUser);
        }
    }

    logOut() {
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('userData');
        localStorage.removeItem('isNightMode');

    }

    getUserAccess(UserID: string) {
        return this.http.get<any>( this.baseUrl + '/project/a_Access.php?UserID=' + UserID );
    }

    

}

