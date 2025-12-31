import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';

import { TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { ConnectionNameSelect } from '../../connection-name-select/connection-name-select';

@Component({
  standalone: true,
  selector: 'app-general-payment-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiLabel,
    TuiDataListWrapper,
    ConnectionNameSelect,
  ],
  templateUrl: './general-payment-input.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class GeneralPaymentInput {
  @Input() connectionNameOptions: readonly string[] = [];
}
