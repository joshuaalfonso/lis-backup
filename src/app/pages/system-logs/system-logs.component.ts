import { Component, OnDestroy, OnInit } from '@angular/core';
import { SystemLogsService } from './system-logs.service';
import { Subscription, from, take } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from '../../auth/auth.service';

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
  selectedUser!: string;

  fromDate!: Date | null;
  toDate!: Date | null;

  view: boolean = false;

  userID!: string;

  tableNames: any[] = [];
  users: any[] = [];
  selectedTableName!: string;

  subscriptions: Subscription = new Subscription;

  rangeDates: Date[] | undefined;

  maxDateRange: Date = new Date();

  constructor(
    private SystemLogsService: SystemLogsService,
    private UsersService: UsersService,
    private auth: AuthService,
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
    this.getTableName();
    this.getUsersList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getTableName() {
    this.tableNames = [
      {
        tableNameID: 1,
        tableName: 'Raw Material',
      },
      {
        tableNameID: 2,
        tableName: 'Warehouse Location',
      },
      {
        tableNameID: 3,
        tableName: 'Warehouse Partition',
      },
      {
        tableNameID: 4,
        tableName: 'Raw Material Inventory',
      },
      {
        tableNameID: 5,
        tableName: 'Raw Material Inventory',
      },
      {
        tableNameID: 6,
        tableName: 'Warehouse Inventory',
      },
      {
        tableNameID: 7,
        tableName: 'Truck',
      },
      {
        tableNameID: 8,
        tableName: 'Trucking',
      },
      {
        tableNameID: 9,
        tableName: 'Checker',
      },
      {
        tableNameID: 10,
        tableName: 'Local Supplier',
      },
      {
        tableNameID: 11,
        tableName: 'Import Supplier',
      },
      {
        tableNameID: 12,
        tableName: 'Raw Material PO',
      },
      {
        tableNameID: 13,
        tableName: 'Importation',
      },
      {
        tableNameID: 14,
        tableName: 'Unloading',
      },
      {
        tableNameID: 15,
        tableName: 'Binloading',
      },
      {
        tableNameID: 16,
        tableName: 'Raw Material Transfer',
      },
      {
        tableNameID: 17,
        tableName: 'Raw Material Transfer',
      },
      {
        tableNameID: 18,
        tableName: 'Raw Material Inspection',
      },
      {
        tableNameID: 19,
        tableName: 'Users',
      },
      {
        tableNameID: 20,
        tableName: 'Module',
      },
      {
        tableNameID: 21,
        tableName: 'Shipping Line',
      },
      {
        tableNameID: 22,
        tableName: 'Port of Discharge',
      },
      {
        tableNameID: 23,
        tableName: 'Bank',
      },
      {
        tableNameID: 23,
        tableName: 'Broker',
      },
      {
        tableNameID: 24,
        tableName: 'Container Type',
      },
    ]
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

  getUsersList() {
    this.subscriptions.add(
      this.UsersService.getData().subscribe(
        response => {
          this.users = response
        },
        error => {
          console.error(error);
        }
      )
    )
  }

  groupedUsers() {

    const groupedByDepartment = Object.values(
      this.users.reduce((acc, user) => {
        const dept = user.ModuleName;
        if (!acc[dept]) {
          acc[dept] = {
            label: dept,
            items: []
          };
        }
        acc[dept].items.push({
          label: user.UName,
          value: user.UserID,
          name: user.Name
        });
        return acc;
      }, {})
    );

    return groupedByDepartment

  }

  getSelectedUserName() {

    if (!this.selectedUser) return null;

    const result = this.users.find(item => item.UserID === this.selectedUser);
    return result?.Name || ''

  }

  filteredLogs() {

    return this.systemLogs.filter(log => {
      const matchesLog = this.selectedLog ? log.FunctionID === this.selectedLog : true;
      const matchesTable = this.selectedTableName ? log.TableName === this.selectedTableName : true;
      const matchesUser = this.selectedUser ? log.UserID === this.selectedUser : true

      return matchesLog && matchesTable && matchesUser
    });

    // if (this.selectedLog) {
    //   return this.systemLogs.filter(log => log.FunctionID === this.selectedLog);
    // }

    // if (this.selectedTableName) {
    //   return this.systemLogs.filter(log => log.TableName === this.selectedTableName);
    // }

    // return this.systemLogs; 
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

  onFilterDate() {

    const startDate: Date | undefined = this.rangeDates?.[0];
    const endDate: Date | undefined = this.rangeDates?.[1];

    if (startDate && endDate) {
      this.isLoading = true;
      this.subscriptions.add(
        this.SystemLogsService.filterDate(startDate.toLocaleDateString('en-CA'), endDate.toLocaleDateString('en-CA')).subscribe(
          (response: any) => {
            this.systemLogs = response;
            this.isLoading = false;
          },
          error => {
            console.error(error);
            this.isLoading = false;
          }
        )
      )
    }

  }

  handleChipRemove() {
    this.fromDate = null;
    this.toDate = null;

    this.rangeDates = [];
    
    this.getSystemLogs();
  }

  onRmoveTableChip() {
    this.selectedTableName = '';
  }

  
  onRemoveLogChip() {
    this.selectedLog = 0
  }

  onRemoveUserChip() {
    this.selectedUser = '';
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
