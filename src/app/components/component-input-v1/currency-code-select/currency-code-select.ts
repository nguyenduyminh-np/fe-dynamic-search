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

import { TuiStringMatcher } from '@taiga-ui/cdk';
import { CurrencyCodeOption } from '../../../core/models/common.model';

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
  @Input() options: readonly CurrencyCodeOption[] = [];
  @Input() label = 'Mã loại tiền tệ';
  @Input() placeholder = '';

  readonly stringify = (item: CurrencyCodeOption): string => item?.label ?? '';
  readonly matcher: TuiStringMatcher<CurrencyCodeOption> = (item, search) => {
    return item.label.toLowerCase().includes(search.toLowerCase());
  };
}
