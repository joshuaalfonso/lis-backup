import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { AccountDetails, AccountDetailsService } from "./account-details.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../auth/user.model";
import { MessageService } from "primeng/api";
import { AvatarService } from "src/assets/avatar/avatar.service";





@Component({
    selector: 'app-account-details',
    templateUrl: 'account-details.component.html',
    styleUrls: ['account-details.component.css']
})
export class AccountDetailsComponent implements OnInit, OnDestroy{

    loading: boolean = false;

    userID: string = '';

    userData: any[] = [];

    userDataForm!: FormGroup;

    selectedAvatar!: number;

    // userSub: Subscription = new Subscription;

    subscriptions: Subscription = new Subscription;

    avatarList: any[] = [];

    constructor(
        private authService: AuthService,
        private accountDetailsService: AccountDetailsService,
        private messageService: MessageService,
        private avatarService: AvatarService
    ) {}
    
    ngOnInit(): void {

        this.userDataForm = new FormGroup({
            'UserID': new FormControl(null),
            'AvatarUrl': new FormControl(null),
            'UName': new FormControl(null, Validators.required),
            'Name': new FormControl(null, Validators.required),
            'ContactNo': new FormControl(null, Validators.required),
            'EmailAdd': new FormControl(null, Validators.required),
        })


        this.subscriptions.add(
            this.authService.user.subscribe(user => {
                if (user) {
                    this.userID = user.user_id;
                }
            })
        )

        this.avatarList = this.avatarService.getAvatar();
        

        this.subscriptions.add(

            this.accountDetailsService.getUserDetails(this.userID).subscribe(
                (response) => {
                    this.userData = response
                    this.userDataForm.setValue({
                        ...response
                    })

                    this.selectedAvatar = +response.AvatarUrl ? +response.AvatarUrl : 0

                },
                err => {
                    console.error('error: ' + err)
                }
            )
        )

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    selectAvatar(i: number) {
        if (i == this.selectedAvatar) {
            this.selectedAvatar = 0;
            console.log('same')
        }

        this.userDataForm.value.AvatarUrl = i;
        this.selectedAvatar = i;
    }

    getImageUrl(i: any) {
        if (i === undefined) {
            return 'assets/avatar/avatar-unknown.png'
        }

        return this.avatarList[i].avatarUrl
    }

    hasChanges() {
        return JSON.stringify(this.userData) !== JSON.stringify(this.userDataForm.value);
    }


    // const userData: {
    //     user_id: string;
    //     username: string;
    //     avatar: number;
    //     _token: string;
    //     _tokenExpirationDate: string;
    //     usl: string;
    //     accessDetail: any[]
    // } = JSON.parse(localStorage.getItem('userData')!);

    // if (!userData) {
    //     return;
    // }

    // const loadedUser = new User(
    //     userData.user_id,
    //     userData.username, 
    //     userData.avatar, 
    //     userData._token, 
    //     new Date(userData._tokenExpirationDate),
    //     userData.usl,
    //     userData.accessDetail
        
    // );
    
    // if(loadedUser.token) {
    //     this.user.next(loadedUser);
    // }

    onSubmit() {

        if (!this.userDataForm.valid) {
            alert('Please fill all the blanks')
            return 
        }

        this.loading = true;

        let data: AccountDetails = {
            UserID: this.userDataForm.value.UserID,
            AvatarUrl: this.selectedAvatar,
            UName: this.userDataForm.value.UName,
            Name: this.userDataForm.value.Name,
            ContactNo: this.userDataForm.value.ContactNo,
            EmailAdd: this.userDataForm.value.EmailAdd,
        }

        this.accountDetailsService.updateUserDetails(data).subscribe(
            response => {
                
                if (response === 2) {

                    this.loading = false;

                    let userData: {
                        user_id: string;
                        username: string;
                        avatar: number;
                        _token: string;
                        _tokenExpirationDate: string;
                        usl: string;
                        accessDetail: any[]
                    } = JSON.parse(localStorage.getItem('userData')!);

                    userData = {
                        ...userData,
                        username: this.userDataForm.value.UName,
                        avatar: this.selectedAvatar
                    }

                    const updatedUserData = new User(
                        userData.user_id,
                        userData.username, 
                        userData.avatar, 
                        userData._token, 
                        new Date(userData._tokenExpirationDate),
                        userData.usl,
                        userData.accessDetail
                            
                    );

                    localStorage.setItem('userData', JSON.stringify(updatedUserData));

                    this.authService.user.next(updatedUserData);

                    this.userData = {...this.userDataForm.value}

                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Successfully updated', 
                        life: 3000 
                    });

                }

            },
            err => {
                console.error('Error ' + err)
                this.loading = false;
            }
        )

    }

}