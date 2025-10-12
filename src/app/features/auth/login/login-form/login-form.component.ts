import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonLabel, IonInput, IonIcon, IonButton, IonInputPasswordToggle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonButton, IonIcon, IonInput, IonLabel, IonInputPasswordToggle]
})
export class LoginFormComponent  implements OnInit {
  private router = inject(Router);

  constructor() { }

  ngOnInit() {}
  
  onSubmit() {
    this.router.navigate(['tabs/inicio']);
  }
}