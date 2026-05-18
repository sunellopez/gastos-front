import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonButton, IonItem, IonInput, IonDatetime, IonTextarea, IonModal, IonDatetimeButton, ModalController, ToastController, LoadingController, IonIcon, AlertController } from "@ionic/angular/standalone";
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ExpenseService } from '../../../core/services/expense-service';
import { GastosIAService, TopCategory } from '../../../core/services/gastos-ia.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  imports: [CommonModule, IonIcon, IonDatetimeButton, IonModal, IonTextarea, ReactiveFormsModule, IonDatetime, IonInput, IonItem, IonButton]
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private expenseService = inject(ExpenseService);
  private gastosIAService = inject(GastosIAService);
  private toastController = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);
  
  today = new Date();
  todayString = `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`;

  form = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: [this.todayString, Validators.required],
  });
  
  showCalendar = false;

  // ML / AI Variables
  detectedCategory: string | null = null;
  detectedConfidence: number = 0;
  top3Categories: TopCategory[] = [];

  constructor() { }

  ngOnInit() {
    // Monitorizar en tiempo real los cambios en descripción y monto para clasificar con la IA
    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged((prev, curr) => prev.description === curr.description && prev.amount === curr.amount)
    ).subscribe(val => {
      this.checkClassification(val.description, val.amount);
    });
  }

  checkClassification(description: string | null | undefined, amount: any) {
    const desc = (description || '').trim();
    const amt = Number(amount);

    if (desc.length >= 4 && amt > 0) {
      this.gastosIAService.clasificarGasto(desc, amt, this.form.value.date || undefined).subscribe({
        next: (res) => {
          this.detectedConfidence = res.confianza;
          this.top3Categories = res.top3;
          
          if (res.confianza >= 0.8) {
            this.detectedCategory = res.categoria;
          } else {
            // Confianza baja: permitimos que el usuario elija una de las sugeridas
            this.detectedCategory = null;
          }
        },
        error: (err) => {
          console.error('Error de clasificación de IA:', err);
        }
      });
    } else {
      this.detectedCategory = null;
      this.detectedConfidence = 0;
      this.top3Categories = [];
    }
  }

  selectCategory(category: string) {
    this.detectedCategory = category;
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const expenseValues = this.form.value;
    const payload = {
      description: expenseValues.description!,
      amount: Number(expenseValues.amount!),
      date: expenseValues.date!,
      category: this.detectedCategory || 'Otros'
    };
    
    const loading = await this.loadingCtrl.create({
      message: 'Analizando con IA...',
    });
    await loading.present();

    // 1. Evaluar si representa una anomalía en tiempo real
    this.gastosIAService.detectarAnomalia({
      description: payload.description,
      amount: payload.amount,
      date: payload.date
    }).subscribe({
      next: async (anomalyRes) => {
        loading.dismiss();
        
        if (anomalyRes.esAnomalo) {
          // Gasto anómalo: desplegar alerta interactiva
          const alert = await this.alertCtrl.create({
            header: '⚠️ Gasto Inusual Detectado',
            subHeader: anomalyRes.razon,
            message: `Este cargo sale de tu patrón de consumo habitual (Score: ${anomalyRes.score.toFixed(2)}). ¿Estás seguro de que deseas registrarlo?`,
            mode: 'ios',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel'
              },
              {
                text: 'Sí, Registrar',
                handler: () => {
                  this.saveExpense({
                    ...payload,
                    is_anomalous: true,
                    anomaly_score: anomalyRes.score
                  });
                }
              }
            ]
          });
          await alert.present();
        } else {
          // Gasto normal: guardar directamente
          this.saveExpense({
            ...payload,
            is_anomalous: false,
            anomaly_score: anomalyRes.score
          });
        }
      },
      error: (err) => {
        console.error('Error al detectar anomalías:', err);
        loading.dismiss();
        // Fallback: guardar sin anomalía si falla la conexión
        this.saveExpense({
          ...payload,
          is_anomalous: false,
          anomaly_score: null
        });
      }
    });
  }

  async saveExpense(payload: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando gasto...',
    });
    await loading.present();

    this.expenseService.add(payload)
    .pipe(
      finalize(() => {
        loading.dismiss();
      })
    )
    .subscribe({
      next: (res: any) => {
        this.modalCtrl.dismiss({ refresh: true });
        this.presentToast(res.message, 'success', 'checkmark-circle');
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Error al conectar con el servidor';
        this.presentToast(errorMsg, 'danger', 'alert-circle');
      }
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async presentToast(msg: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: color,
      icon: icon
    });

    await toast.present();
  }

  openCalendar() {
    this.showCalendar = true;
  }

  cancelCalendar() {
    this.showCalendar = false;
  }
}