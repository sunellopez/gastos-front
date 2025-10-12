import { Component, OnInit } from '@angular/core';
import { IonLabel, IonInput, IonIcon, IonButton, IonInputPasswordToggle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [IonButton, IonIcon, IonInput, IonLabel, IonInputPasswordToggle]
})
export class SignupFormComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
