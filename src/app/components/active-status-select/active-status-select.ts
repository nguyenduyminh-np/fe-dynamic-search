import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiComboBox,
  TuiFilterByInputPipe,
} from '@taiga-ui/kit';
import { ActiveStatus } from '../../shared/util/payment-channel-create.util';
import { TuiStringMatcher } from '@taiga-ui/cdk';

@Component({
  standalone: true,
  selector: 'app-active-status-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiChevron,
    TuiDataListWrapper,
    TuiComboBox,
    TuiFilterByInputPipe,
  ],
  templateUrl: './active-status-select.html',
  styleUrl: './active-status-select.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class ActiveStatusSelect {
  @Input() options: readonly ActiveStatus[] = [];
  @Input() label = 'Trạng thái hoạt động';
  @Input() placeholder = '';

  readonly stringify = (item: ActiveStatus): string => item?.label ?? '';
  readonly matcher: TuiStringMatcher<ActiveStatus> = (item, search) => {
    return item.label.toLowerCase().includes(search.toLowerCase());
  };
}
