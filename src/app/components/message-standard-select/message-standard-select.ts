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
  selector: 'app-msg-standard-select',
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
  templateUrl: './message-standard-select.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class MessageStandardSelect {
  @Input() options: readonly string[] = [];
  @Input() label = 'Chuẩn tin điện tử';
  @Input() placeholder = '';
}
