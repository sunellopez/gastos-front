import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonItem, IonInput, IonDatetime, IonTextarea, IonModal, IonDatetimeButton, ModalController, ToastController, LoadingController, IonIcon } from "@ionic/angular/standalone";
import { finalize } from 'rxjs';
import { ExpenseService } from '../../../core/services/expense-service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  imports: [IonIcon, IonDatetimeButton, IonModal, IonTextarea, ReactiveFormsModule, IonDatetime, IonInput, IonItem, IonButton]
})
export class ExpenseFormComponent  implements OnInit {
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController)
  private expenseService = inject(ExpenseService);
  private toastController = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  today = new Date();
  todayString = `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`;

  form = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: [this.todayString, Validators.required],
  });
  showCalendar = false;
  
  constructor() { }

  ngOnInit() {}

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const expense = this.form.value;
    
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
    });

    loading.present();

    this.expenseService.add(expense)
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
        this.presentToast(err.error.message, 'danger', 'alert-circle');
      }
    })
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async presentToast(msg: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
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