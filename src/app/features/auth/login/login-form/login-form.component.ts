import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { IonLabel, IonInput, IonIcon, IonButton, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonButton, IonIcon, IonInput, IonLabel, IonInputPasswordToggle, ReactiveFormsModule]
})
export class LoginFormComponent  implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\d]).+$')]]
  });

  constructor() { }

  ngOnInit() {}
  
  onSubmit() {
    if (this.form.invalid) return;
    
    const userData = this.form.value;
    
    this.authService.login(userData).subscribe({
      next: (res: any) => {
        if(res.success == 1){
          this.router.navigate(['tabs/inicio']);
        }
      },
      error: (err: any) => {

      }
    });
  }
}