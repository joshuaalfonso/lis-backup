import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

    constructor(
        private authService: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.authService.token;

        if (!token) {
            return next.handle(req);
        }

        const tokenizedReq = req.clone({
            headers: 
            req.headers
            .set('Content-Type', 'application/json')
            .set('Token', token)
        })

        return next.handle(tokenizedReq);
    }

}