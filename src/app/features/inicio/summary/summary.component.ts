import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel, IonSkeletonText, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [IonIcon, DatePipe, CurrencyPipe, IonSkeletonText, IonLabel, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard]
})
export class SummaryComponent  implements OnInit {
  summary = input<any>({
    total: 0,
    start: '',
    end: '',
    count: 0
  });
  isLoadingSummary = input<boolean>(false);
  
  constructor() { }

  ngOnInit() {}

}