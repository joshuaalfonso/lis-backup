import { Component, OnInit } from '@angular/core';
import { ContractPerformaService } from '../../../contract-performa/contract-performa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-importation-dashboard',
  templateUrl: './importation-dashboard.component.html',
  styleUrls: ['./importation-dashboard.component.css']
})
export class ImportationDashboardComponent implements OnInit{

  data: any;

  options: any;

  balanceAtPort: number = 0;
  balanceContainer: number = 0;
  sailingBulk: number = 0;
  sailingContainerized: number = 0;
  salingBulkList: any[] = [];
  sailingContainerizedList: any[] = [];
  bulk: any[] = [];
  ataToday: any[] = [];
  oneWeekEta: any[] = [];
  allSailingList: any[] = [];

  today: Date = new Date();

  subscriptions: Subscription = new Subscription;

  constructor(
    private ContractPerformaService: ContractPerformaService
  ) {}

  ngOnInit(): void {

    this.getBalanceAtPort();
    this.getBalanceContainer();
    this.getBulkTable();
    this.getSailingData();
    this.getSailingList();  
    this.getActualTimeArrival();
    this.getUpcomingEta();
  }


  getUpcomingEta() {
    this.subscriptions.add(
      this.ContractPerformaService.getRecentEta().subscribe(
        response => {
          this.oneWeekEta = response;
          // console.log(response);
          
        },
        error => {
          console.error('There was an error fetching recent ETA, ' + error)
        }
      )
    ) 
  }

  getBalanceAtPort() {
    this.subscriptions.add(
      this.ContractPerformaService.getBalanceAtPort().subscribe(
        response => {
          this.balanceAtPort = response[0]?.BalanceAtPort;
        },
        error => {
          console.error('There was an error fetching balance at port. ' + error)
        }
      )
    )
  }

  getBalanceContainer() {
    this.subscriptions.add(
      this.ContractPerformaService.BalanceContainer().subscribe(
        response => {
          this.balanceContainer = response[0]?.BalanceContainer;
        },
        error => {
          console.error('There was an error fetching balance container. ' + error)
        }
      )
    )
  }

  getBulkTable() {
    this.subscriptions.add(
      this.ContractPerformaService.getLegalDashboard4().subscribe(
        response => {
          this.bulk = response;
        }, 
        error => {
          console.error('There was an error fetching bulk table. ' + error)
        }
      )
    )
  }

  getSailingData() {
    this.subscriptions.add(
      this.ContractPerformaService.getSailingData().subscribe(
        response => {
          this.sailingContainerized = response.length;
          this.sailingContainerizedList = response;
        },
        error => {
          console.error('There was an error fetching sailing table. ' + error)
        }
      )
    )
  }

  getSailingList() {
    this.subscriptions.add(
      this.ContractPerformaService.getLegalDashboard5().subscribe(
        response => {

          this.sailingBulk = response.filter(
            (item: any) => item.Packaging === 2
          )?.length || 0;
          // this.sailingContainerizedList = response.filter((item: any) => item.Packaging === 1);

          this.allSailingList = response;

        }
      )
    ) 
  }

  getActualTimeArrival() {
    this.subscriptions.add(
      this.ContractPerformaService.getLegalDashboard3().subscribe(
        response => {
          this.ataToday = response;
          // console.log(response);
          
        }
      )
    )
  }

  getRoundedPercentage(served: number, requestWeight: number, precision: number): number {
    if (requestWeight === 0) return 0; // Avoid division by zero
    const percentage = (served / requestWeight) * 100;
    // return Number(percentage.toFixed(2)); 

    return Math.round(percentage);
  }


  getChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 45, 75, 60, 50, 90, 80],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--indigo-500'),
          tension: 0.4,
          backgroundColor: 'red'
        },
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      responsive: false,
      plugins: {
          legend: {
            display: false
          }
      },
      elements: {
        line: {
            borderWidth: 3, // Line border width (you can adjust this if needed)
        },
        point: {
            radius: 0 // If you don't want points on the line, set radius to 0
        }
      },
      scales: {
          x: {
              display: false,
              ticks: {
                display: false
              },
              grid: {
                  color: false,
                  drawBorder: false
              }
          },
          y: {
            display: false, // Hide y-axis
            ticks: {
                display: false // Hide y-axis ticks
            },
            grid: {
                display: false // Hide y-axis grid lines
            }
        }
      },
      animation: {
          duration: 0 // Disable animation for a clean look
      },
    };
  }


}
