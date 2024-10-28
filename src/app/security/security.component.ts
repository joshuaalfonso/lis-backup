import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChangePassword, SecurityService } from "./security.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";



@Component({
    selector: 'app-security',
    templateUrl: 'security.component.html',
    styleUrls: ['security.component.css']
})
export class SecurityComponent implements OnInit, OnDestroy {


    passwordForm!: FormGroup;

    subscriptions: Subscription = new Subscription;

    UserID: string = '';

    messages: any[] = [
        // { severity: 'success', detail: 'Password successfully updated' },
        // { severity: 'error', detail: 'Current password is incorrect' },
    ];

    constructor(
        private securityService: SecurityService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {

        this.passwordForm = new FormGroup({
            'CurrentPassword': new FormControl(null, Validators.required),
            'NewPassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
            'ConfirmNewPassword': new FormControl(null, Validators.required),
        })


        this.subscriptions.add(
            this.authService.user.subscribe( user => {
                if (user) {
                    this.UserID = user.user_id;
                }
            })
        )
        
    }

    ngOnDestroy(): void {
        
    }


    onSubmit() {
        
        if (this.passwordForm.value.NewPassword !== this.passwordForm.value.ConfirmNewPassword) {
            this.messages = [{ severity: 'error', detail: 'New Password does not match' }]
            return
        }

        const data: ChangePassword = {
            CurrentPassword: this.passwordForm.value.CurrentPassword,
            NewPassword: this.passwordForm.value.NewPassword,
            ConfirmNewPassword: this.passwordForm.value.ConfirmNewPassword
        }

        this.securityService.changePassword(this.UserID, data).subscribe(
            response => {
                console.log(response);
                if (response === 0) {
                    // alert('Wrong current password');
                    this.messages = [{ severity: 'error', detail: 'Current password is incorrect' }];
                }

                if (response === 2) {
                    this.messages = [{ severity: 'success', detail: 'Password successfully updated' }];
                    this.passwordForm.reset();
                }

            }, err => {
                console.error('error :' + err)
            }
        )


    }




}