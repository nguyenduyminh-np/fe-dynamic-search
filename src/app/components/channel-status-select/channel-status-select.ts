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
import { ChannelStatus } from '../../shared/util/payment-channel-create.util';
import { TuiStringMatcher } from '@taiga-ui/cdk';

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
  @Input() options: readonly ChannelStatus[] = [];
  @Input() label = 'Trạng thái kênh thanh toán';
  @Input() placeholder = '';

  readonly stringify = (item: ChannelStatus): string => item?.label ?? '';
  readonly matcher: TuiStringMatcher<ChannelStatus> = (item, search) => {
    return item.label.toLowerCase().includes(search.toLowerCase());
  };
}
