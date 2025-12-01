import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IonThumbnail, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonNote, IonList, IonFab, IonFabButton, IonIcon, IonModal, IonButtons, IonButton, IonInfiniteScroll, IonInfiniteScrollContent, IonSkeletonText, IonListHeader, IonText } from '@ionic/angular/standalone';
import { ExpenseService } from '../../core/services/expense-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { SummaryComponent } from './summary/summary.component';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [IonText, IonListHeader, SummaryComponent, DatePipe, IonThumbnail, IonSkeletonText, CurrencyPipe, IonInfiniteScrollContent, IonInfiniteScroll, IonButton, IonButtons, ExpenseFormComponent, IonModal, IonIcon, IonFabButton, IonFab, IonList, IonNote, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent],
  standalone: true
})

export class InicioPage implements OnInit {

   private expenseService = inject(ExpenseService);
  
  protected isOpen = false;
  protected summary = signal<any>({
    total: 0,
    start: '',
    end: '',
    count: 0
  });
  expenses: any[] = [];
  currentPage = 1;
  hasMore = true;
  isLoading = false;
  isLoadingSummary: WritableSignal<boolean> = signal(false);

  constructor() {}

  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    this.resetState();
    this.loadExpenses();
    this.loadSummary();
  }

  loadSummary() {
    this.isLoadingSummary.set(true);

    this.expenseService.getWeeklySummary()
    .pipe(
      finalize(() => {
        this.isLoadingSummary.set(false);
      })
    )
    .subscribe({
      next: (res: any) => {
        this.summary.set(res.data);
      },
      error(err: any) {
        console.log('Error:', err)
      },
    });
  }

  openNewExpenseModal() {
    this.isOpen = true;
  }

  handleDismiss(event: CustomEvent) {
    const data = event.detail.data;
    if (data?.refresh) {
      this.loadSummary();
      this.currentPage = 1;
      this.expenses = [];
      this.hasMore = true;
      this.loadExpenses();
    }
    this.isOpen = false;
  }

  loadExpenses(event?: any) {
    if (!event) {
      this.isLoading = true;
    }

    this.expenseService.getExpenses(this.currentPage)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe({
      next: (res: any) => {
        this.expenses = [...this.expenses, ...res.data];

        this.hasMore = res.current_page < res.last_page;

        this.currentPage++;

        if (event) {
          event.target.complete();
        }
      },
      error(err: any) {
        console.log('Error:', err);
        if (event) {
          event.target.complete();
        }
      },
    });
  }

  resetState() {
    this.currentPage = 1;
    this.expenses = [];
  }
}