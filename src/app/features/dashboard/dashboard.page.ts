import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonList, IonItem, IonLabel, IonNote, IonProgressBar, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth-service';
import { ExpenseService } from 'src/app/core/services/expense-service';
import { GastosIAService } from 'src/app/core/services/gastos-ia.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, 
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, 
    IonIcon, IonList, IonItem, IonLabel, IonNote, IonProgressBar, IonSpinner, 
    CommonModule, FormsModule
  ]
})
export class DashboardPage implements OnInit {
  private authService = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private gastosIAService = inject(GastosIAService);

  user = this.authService.getUserSignal(); // Obtener la referencia pública al Signal del usuario
  
  loading = true;
  
  // AI Predictions
  montoEstimado = 0;
  intervaloConfianza: [number, number] = [0, 0];
  mesObjetivoNombre = '';
  
  // Metrics
  highestExpense: any = null;
  weeklyTotal = 0;
  weeklyLimit = 5000; // Límite por defecto para barra de progreso
  
  // Anomaly History
  recentAnomalies: any[] = [];

  constructor() { }

  ngOnInit() {
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    const activeUser = this.user();
    
    if (!activeUser) {
      this.loading = false;
      return;
    }

    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.mesObjetivoNombre = months[nextMonthDate.getMonth()];
    const mesObjetivo = nextMonthDate.getMonth() + 1;

    forkJoin({
      prediction: this.gastosIAService.predecirMes(String(activeUser.id), mesObjetivo),
      highest: this.expenseService.getHighestExpenseThisWeek(),
      summary: this.expenseService.getWeeklySummary(),
      expenses: this.expenseService.getExpenses(1)
    }).subscribe({
      next: (res) => {
        // 1. Cargar Predicción de Gasto mensual de la IA
        this.montoEstimado = res.prediction.montoEstimado;
        this.intervaloConfianza = res.prediction.intervaloConfianza;
        
        // 2. Cargar Gasto más alto de la semana
        this.highestExpense = res.highest?.data || null;
        
        // 3. Cargar Resumen Semanal
        this.weeklyTotal = Number(res.summary?.data?.total_semana || 0);
        
        // 4. Cargar Historial de Anomalías Recientes filtrando del listado de gastos
        const allExpenses = res.expenses?.data?.data || [];
        this.recentAnomalies = allExpenses.filter((e: any) => e.is_anomalous == 1 || e.is_anomalous === true);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard:', err);
        this.loading = false;
      }
    });
  }

  getWeeklyProgress(): number {
    if (this.weeklyTotal <= 0) return 0;
    return Math.min(1.0, this.weeklyTotal / this.weeklyLimit);
  }
}
