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
  selector: 'app-connection-name-select',
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
  templateUrl: './connection-name-select.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class ConnectionNameSelect {
  @Input() options: readonly string[] = [];
  @Input() label = 'Phương thức kết nối';
  @Input() placeholder = '';
}
