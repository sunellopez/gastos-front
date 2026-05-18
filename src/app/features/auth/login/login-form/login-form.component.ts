import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonLabel, IonInput, IonIcon, IonButton, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonInput, IonLabel, IonInputPasswordToggle, ReactiveFormsModule]
})
export class LoginFormComponent implements OnInit {
  private router = inject(NavController);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor() { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateRoot(['/tabs'], { replaceUrl: true });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const userData = this.form.value;

    this.authService.login(userData).subscribe({
      next: (res: any) => {
        if (res.success == 1) {
          this.authService.setAuthToken(res.token);
          this.authService.setSession(res.user);
          this.router.navigateRoot(['/tabs'], { replaceUrl: true });
        }
      },
      error: (err: any) => {

      }
    });
  }
}