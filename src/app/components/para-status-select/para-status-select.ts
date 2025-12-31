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
  selector: 'app-para-status-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiLabel,
    TuiChevron,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiComboBox,
  ],
  templateUrl: './para-status-select.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class ParaStatusSelect {
  @Input() options: readonly number[] = [];
  @Input() label = 'Trạng thái tham số';
  @Input() placeholder = '';
}
