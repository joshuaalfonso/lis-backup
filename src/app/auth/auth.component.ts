import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{

    loginForm!: FormGroup;

    loading: boolean = false;

    constructor(
        private AuthService: AuthService, private http: HttpClient,
        private router: Router,
        private MessageService: MessageService
    ){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110'; 

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            'user_id': new FormControl(0),
            'username': new FormControl(null, Validators.required),
            'password': new FormControl(null, Validators.required)
        })

        if(this.AuthService.user) {
            this.router.navigate(['/dashboard']);
        }

    }


    onLogin(){

        if (!this.loginForm.valid) {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Please fill in the blanks', life: 3000 });
            return;
        }

        this.loading = true;
        let authObs: Observable<ResponseData>;
        authObs = this.AuthService.login( this.loginForm.value.user_id, this.loginForm.value.username, this.loginForm.value.password);

        authObs.subscribe( (resData: any) => {
            this.loading = false;        

            if(resData.data) {
                this.router.navigate(['dashboard']);
            } else if (resData.status === -1) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Incorrect Email or Password', life: 3000 });
            }

        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
            this.loading = false;
        })
    }


}

interface ResponseData{
  
}
