import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, addOutline, alertCircle, bookmarkOutline, calendarOutline, cartOutline, cashOutline, checkmarkCircle, close, closeOutline, createOutline, exitOutline, homeOutline, listOutline, logoUsd, logOutOutline, notificationsOutline, personCircleOutline, personOutline, pieChartOutline, rocketOutline, settingsOutline, syncOutline, walletOutline, mailOutline, lockClosed, mail, person, barChartOutline, lockClosedOutline, analyticsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({ close, personOutline, settingsOutline, rocketOutline, syncOutline, bookmarkOutline, createOutline, personCircleOutline, logOutOutline, exitOutline, notificationsOutline, homeOutline, addOutline, closeOutline, add, alertCircle, checkmarkCircle, cartOutline, walletOutline, pieChartOutline, cashOutline, listOutline, logoUsd, calendarOutline, mailOutline, lockClosed, mail, person, barChartOutline, lockClosedOutline, analyticsOutline });
  }
}
