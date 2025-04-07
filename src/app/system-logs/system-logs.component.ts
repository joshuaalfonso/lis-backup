import { Component, OnInit } from '@angular/core';
import { SystemLogsService } from './system-logs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.css']
})
export class SystemLogsComponent implements OnInit {

  systemLogs: any[] = [];
  isLoading: boolean = false;
  logs: any[] | undefined;
  selectedLog: any | undefined;

  subscriptions: Subscription = new Subscription;

  constructor(
    private SystemLogsService: SystemLogsService
  ) {}

  ngOnInit(): void {
    

    this.getSystemLogs();
    this.getLogs();
  }

  getSystemLogs() {

    this.isLoading = true;
    this.subscriptions.add(
      this.SystemLogsService.getSystemLogs().subscribe(
        response => {
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
