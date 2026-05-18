import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonIcon, IonThumbnail, IonSkeletonText, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, IonButton, IonModal, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonBackButton, NavController } from '@ionic/angular/standalone';
import { ExpenseService } from 'src/app/core/services/expense-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonSegment, 
    IonSegmentButton, IonLabel, IonList, IonItem, IonIcon, IonThumbnail, 
    IonSkeletonText, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, 
    IonButton, IonModal, IonCard, IonCardContent, IonCardHeader, 
    IonCardSubtitle, IonBackButton, CommonModule, CurrencyPipe, DatePipe
  ]
})
export class HistorialPage implements OnInit {
  private expenseService = inject(ExpenseService);
  private navCtrl = inject(NavController);

  expenses = signal<any[]>([]);
  searchQuery = signal<string>('');
  filterType = signal<string>('todos'); // 'todos', 'anomalos', 'normales'
  
  currentPage = 1;
  hasMore = true;
  isLoading = signal<boolean>(false);

  // Modal Detalle
  isDetailOpen = false;
  selectedExpense = signal<any>(null);

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses(event?: any) {
    if (!event) {
      this.isLoading.set(true);
    }

    this.expenseService.getExpenses(this.currentPage, this.searchQuery(), this.filterType())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          if (event) {
            event.target.complete();
          }
        })
      )
      .subscribe({
        next: (res: any) => {
          if (this.currentPage === 1) {
            this.expenses.set(res.data);
          } else {
            this.expenses.set([...this.expenses(), ...res.data]);
          }

          this.hasMore = res.current_page < res.last_page;
          this.currentPage++;
        },
        error: (err) => {
          console.error('Error al cargar historial:', err);
        }
      });
  }

  onSearch(event: any) {
    const value = event.detail.value || '';
    this.searchQuery.set(value);
    this.resetAndLoad();
  }

  onFilterChanged(event: any) {
    const value = event.detail.value || 'todos';
    this.filterType.set(value);
    this.resetAndLoad();
  }

  resetAndLoad() {
    this.currentPage = 1;
    this.hasMore = true;
    this.loadExpenses();
  }

  openDetail(expense: any) {
    this.selectedExpense.set(expense);
    this.isDetailOpen = true;
  }

  goBack() {
    this.navCtrl.back();
  }
}
