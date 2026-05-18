import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonItem, IonInput, IonButton, ToastController, LoadingController, NavController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, 
    IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonItem, 
    IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class PerfilPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private navCtrl = inject(NavController);

  user = this.authService.getUserSignal(); // Signal reactivo del usuario

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.populateForm();
  }

  ionViewWillEnter() {
    this.populateForm();
  }

  populateForm() {
    const activeUser = this.user();
    if (activeUser) {
      this.form.patchValue({
        name: activeUser.name,
        email: activeUser.email
      });
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando perfil...',
    });
    await loading.present();

    this.authService.updateProfile(this.form.value)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          // Actualizar sesión reactiva en el cliente
          await this.authService.setSession(res.data);
          this.presentToast('Perfil actualizado correctamente', 'success', 'checkmark-circle');
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Error al actualizar el perfil';
          this.presentToast(errorMsg, 'danger', 'alert-circle');
        }
      });
  }

  async logout() {
    const loading = await this.loadingCtrl.create({
      message: 'Cerrando sesión...',
    });
    await loading.present();

    this.authService.logout()
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe({
        next: () => {
          this.authService.clearSession();
          this.navCtrl.navigateRoot(['/login'], { replaceUrl: true });
        },
        error: () => {
          // Si falla la red, cerramos de todos modos localmente
          this.authService.clearSession();
          this.navCtrl.navigateRoot(['/login'], { replaceUrl: true });
        }
      });
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
}
