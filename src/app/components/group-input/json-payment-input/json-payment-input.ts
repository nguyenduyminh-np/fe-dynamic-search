import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';

import { TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';

@Component({
  standalone: true,
  selector: 'app-json-payment-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiLabel,
    TuiTextarea,
    TuiIcon,
  ],
  templateUrl: './json-payment-input.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class JsonPaymentInput {
  constructor(private readonly cc: ControlContainer) {}

  private get group(): FormGroup {
    return this.cc.control as FormGroup;
  }

  get jsonDataErrorText(): string | null {
    const c = this.group.get('jsonDataText');
    if (!c || !c.touched || !c.errors) return null;

    if (c.errors['jsonInvalid'])
      return `Dữ liệu JSON không hợp lệ: ${c.errors['jsonInvalid']}`;
    if (c.errors['jsonObject']) return c.errors['jsonObject'];
    if (c.errors['jsonMaxKeys']) return c.errors['jsonMaxKeys'];
    return 'Dữ liệu JSON không hợp lệ.';
  }
}
