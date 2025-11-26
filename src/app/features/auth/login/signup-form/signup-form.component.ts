import { Component, inject, OnInit } from '@angular/core';
import { IonLabel, IonInput, IonIcon, IonButton, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [IonButton, IonIcon, IonInput, IonLabel, IonInputPasswordToggle, FormsModule, ReactiveFormsModule]
})
export class SignupFormComponent  implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\d]).+$')]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor() { }

  ngOnInit() {}

  async save() {
    if (this.form.invalid) return;
    
    const userData = this.form.value;
    
    // const loading = await this.loadingCtrl.create({
    //   message: 'Cargando...',
    // });

    // loading.present();

    this.authService.signUp(userData)
    .pipe(
      finalize(() => {
        // loading.dismiss();
      })
    )
    .subscribe({
      next: (res: any) => {
        this.form.reset();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
      }
    })
  }
}
