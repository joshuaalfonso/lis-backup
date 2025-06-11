import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dispatcher-dashboard',
  templateUrl: './dispatcher-dashboard.component.html',
  styleUrls: ['./dispatcher-dashboard.component.css']
})
export class DispatcherDashboardComponent implements OnInit {

  data: any;

  options: any;

  products!: any[];

  constructor() {

  }

  ngOnInit(): void {

    this.products = [
      {
        vehicle: 'NBS-4961',
        transaction: 'Binload',
        rawMaterial: 'RICE DDGS',
        quantity: 4000
      },
      {
        vehicle: 'NBS-4962',
        transaction: 'Binload',
        rawMaterial: 'PROCESSED ANIMAL PROTEIN',
        quantity: 1300
      },
      {
        vehicle: 'NBH-6512',
        transaction: 'Transfer',
        rawMaterial: 'RAPESEED MEAL',
        quantity: 5000
      },
      {
        vehicle: 'NBH-6512',
        transaction: 'Binload',
        rawMaterial: 'PORCINE MEAL 53% (BULK)',
        quantity: 10000
      },
      {
        vehicle: 'NBH-6512',
        transaction: 'Transfer',
        rawMaterial: 'ARGENTINA SOYA',
        quantity: 3200
      },
      {
        vehicle: 'NBH-6512',
        transaction: 'Transfer',
        rawMaterial: 'US SOYA',
        quantity: 1000
      },
    ]


    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Available', 'Out of Service', 'On Route'],
      datasets: [
        {
            data: [98, 15, 6],
            backgroundColor: [
              documentStyle.getPropertyValue('--indigo-500'), 
              documentStyle.getPropertyValue('--indigo-300'), 
              documentStyle.getPropertyValue('--indigo-100'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--indigo-500'), 
              documentStyle.getPropertyValue('--indigo-300'), 
              documentStyle.getPropertyValue('--indigo-100'),
            ]
        }
      ]
    };


    this.options = {
        cutout: '60%',
        plugins: {
          legend: {
            labels: {
                color: textColor
            }
          }
        }
    };
    
  }

}
