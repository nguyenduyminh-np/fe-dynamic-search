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
  selector: 'app-channel-status-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiLabel,
    TuiChevron,
    TuiDataListWrapper,
    TuiComboBox,
    TuiFilterByInputPipe,
  ],
  templateUrl: './channel-status-select.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class ChannelStatusSelect {
  @Input() options: readonly string[] = [];
  @Input() label = 'Trạng thái kênh thanh toán';
  @Input() placeholder = '';
}
