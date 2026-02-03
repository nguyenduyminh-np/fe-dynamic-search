import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-payment-name-field',
  imports: [ReactiveFormsModule, TuiTextfield],
  templateUrl: './payment-name-field.html',
  styleUrl: './payment-name-field.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class PaymentNameField {}
