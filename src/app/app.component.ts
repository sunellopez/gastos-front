import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, addOutline, alertCircle, bookmarkOutline, calendarOutline, cartOutline, cashOutline, checkmarkCircle, close, closeOutline, createOutline, exitOutline, homeOutline, listOutline, logoUsd, logOutOutline, notificationsOutline, personCircleOutline, personOutline, pieChartOutline, rocketOutline, settingsOutline, syncOutline, walletOutline, mailOutline, lockClosed, mail, person, barChartOutline, lockClosedOutline, analyticsOutline, sparkles, folderOpenOutline, documentTextOutline, warning, searchOutline } from 'ionicons/icons';
import { LoadingService } from './core/services/loading.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonIcon],
  standalone: true
})
export class AppComponent {
  public loadingService = inject(LoadingService);

  constructor() {
    addIcons({ close, personOutline, settingsOutline, rocketOutline, syncOutline, bookmarkOutline, createOutline, personCircleOutline, logOutOutline, exitOutline, notificationsOutline, homeOutline, addOutline, closeOutline, add, alertCircle, checkmarkCircle, cartOutline, walletOutline, pieChartOutline, cashOutline, listOutline, logoUsd, calendarOutline, mailOutline, lockClosed, mail, person, barChartOutline, lockClosedOutline, analyticsOutline, sparkles, folderOpenOutline, documentTextOutline, warning, searchOutline });
  }
}
