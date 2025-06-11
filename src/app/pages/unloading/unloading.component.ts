import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-unloading',
  templateUrl: './unloading.component.html',
  styleUrls: ['./unloading.component.css']
})
export class UnloadingComponent implements OnInit, OnDestroy {


  tabValue: number = 1;

  userID!: string;

  subscriptions: Subscription = new Subscription;

  view: boolean = false;
  insert: boolean = false;
  edit: boolean = false;
  generateReport: boolean = false;
  verifiedView: boolean = false;
  delete: boolean = false;

  constructor(
    private auth: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUser() {
    this.auth.user.pipe(take(1)).subscribe(
      user => {
        if (user) {
          this.userID = user!.user_id;
        }
      }
    )
  }

  getUserAccess(UserID: string) {
    this.subscriptions.add(
      this.usersService.getUserAccess(UserID).subscribe(
        response => {
          let userRights = response;
          // console.log(userRights)
          for (let i = 0; i < userRights.length; i++) {
            switch (userRights[i].AccessRight.trim()) {
              case '3.3.1':
                this.view = true;
                break;
              case '3.3.2':
                this.insert = true;
                break;
              case '3.3.3':
                this.edit = true;
                break;
              case '3.3.4':
                this.generateReport = true;
                break;
              case '3.3.5':
                this.verifiedView = true;
                break;
              case '3.3.6':
                this.delete = true;
                break;
              default:
                  break;
            }
          }
            
        }
      )       
    )
  } 


}
