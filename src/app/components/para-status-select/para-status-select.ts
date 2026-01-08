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
import { ParaStatusOption } from '../../shared/util/payment-channel-create.util';

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
  @Input() options: readonly ParaStatusOption[] = [];
  @Input() label = 'Trạng thái tham số';
  @Input() placeholder = '';

  // stringify: input hiển thị label
  readonly stringify = (item: ParaStatusOption): string => item?.label ?? '';

  // matcher: filter theo label
  readonly matcher: TuiStringMatcher<ParaStatusOption> = (item, search) =>
    item.label.toLowerCase().includes(search.toLowerCase());
}
