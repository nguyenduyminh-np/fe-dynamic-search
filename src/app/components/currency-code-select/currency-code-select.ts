import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiLabel, TuiTextfield } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
} from '@taiga-ui/kit';

@Component({
  standalone: true,
  selector: 'app-currency-code-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiLabel,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
  ],
  templateUrl: './currency-code-select.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class CurrencyCodeSelect {
  @Input() options: readonly string[] = [];
  @Input() label = 'Mã loại tiền tệ';
  @Input() placeholder = '';
}
