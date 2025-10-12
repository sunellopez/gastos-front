import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonButton } from '@ionic/angular/standalone';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LoginFormComponent } from './login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonLabel, IonSegmentButton, IonSegment, IonContent, CommonModule, FormsModule, LoginFormComponent, SignupFormComponent]
})
export class LoginPage implements OnInit {

  protected selectedSegment: string = 'login';

  constructor() { }

  ngOnInit() {
  }
  
}
