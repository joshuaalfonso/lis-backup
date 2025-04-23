import { Component, OnDestroy, OnInit } from '@angular/core';
import { SystemLogsService } from './system-logs.service';
import { Subscription, from, take } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.css']
})
export class SystemLogsComponent implements OnInit, OnDestroy {

  systemLogs: any[] = [];
  isLoading: boolean = false;
  logs: any[] | undefined;
  selectedLog: any | undefined;

  fromDate!: Date | null;
  toDate!: Date | null;

  view: boolean = false;

  userID!: string;


  subscriptions: Subscription = new Subscription;

  constructor(
    private SystemLogsService: SystemLogsService,
    private UsersService: UsersService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {


    this.auth.user.pipe(take(1)).subscribe(
      user => {
          if (user) {
              this.userID = user!.user_id;
              this.getUserAccess(this.userID);
          }
      }
    )

    
    this.getSystemLogs();
    this.getLogs();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUserAccess(UserID: string) {
    this.subscriptions.add(
         this.UsersService.getUserAccess(UserID).subscribe(
             response => {
                 let userRights = response;

                 for (let i = 0; i < userRights.length; i++) {
                     switch (userRights[i].AccessRight.trim()) {
                         case '5.1':
                             this.view = true;
                             break;
                         default:
                             break;
                     }
                 }
                 
             }
         )       
    )
  }

  getSystemLogs() {

    this.isLoading = true;

    this.subscriptions.add(
      this.SystemLogsService.filterDate(null, null).subscribe(
        (response: any) => {
          // console.log(response);
          this.systemLogs = response;
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.isLoading = false;
        }
      )
    )
    
  }

  filteredLogs() {

    if (this.selectedLog) {
      return this.systemLogs.filter(log => log.FunctionID === this.selectedLog);
    }

    return this.systemLogs; 
  }

  onFilterData(date1: any, date2: any) {

    if (!date1 || !date2) return;

    this.isLoading = true;

    const fromDate = new Date(date1).toLocaleDateString('en-CA');
    const toDate = new Date(date2).toLocaleDateString('en-CA');
    
    this.subscriptions.add(
      this.SystemLogsService.filterDate(fromDate, toDate).subscribe(
        (response: any) => {
          // console.log(response);
          this.systemLogs = response;
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.isLoading = false;
        }
      )
    )
    
  }

  handleChipRemove() {
    this.fromDate = null;
    this.toDate = null;
    
    this.getSystemLogs();
  }

  
  onRemoveLogChip() {
    this.selectedLog = 0
  }

  findLogName(selectedLogID: number) {
    let data = ''

    for(let i = 0; i < this.logs!.length; i++) {
      if (this.logs![i].logID === selectedLogID) {
        data = this.logs![i].logName
      }
    }

    return data
  }

  getLogs() {
    this.logs = [
      { logName: 'Insert', logID: 1 },
      { logName: 'Edit', logID: 2 },
      { logName: 'Delete', logID: 3 },
      { logName: 'Logged In', logID: 5 },
      { logName: 'View', logID: 7 },
    ];
  }
  

  getFunction(functionID: number) {

    // return null

    switch (functionID) {

      case 1:
        return 'text-indigo-500 font-semibold';
      case 2:
        return 'text-green-500 font-semibold';
      case 3:
        return 'text-red-500 font-semibold';
      case 5:
        return 'text-blue-500 font-semibold';
      case 7:
        return 'text-orange-500 font-semibold';
      default:
        return null;
    }

  }

  getIcon(functionID: number) {
    if (functionID === 1) {
      return 'fi fi-sr-add'
    } else if (functionID === 2) {
      return 'fi fi-sr-pen-circle'
    } else if (functionID === 3) {
      return 'fi fi-sr-cross-circle'
    } else if (functionID === 5) {
      return 'fi fi-sr-angle-circle-right'
    } else if (functionID === 7) {
      return 'fi fi-sr-eye'
    }

    return null
  }

}
