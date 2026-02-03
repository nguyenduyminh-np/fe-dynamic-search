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
import { Option } from '../../../core/models/common.model';
import { TuiStringMatcher } from '@taiga-ui/cdk';

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
  @Input() options: readonly Option<string>[] = [];
  @Input() label = 'Chuẩn tin điện tử';
  @Input() placeholder = '';

  readonly stringify = (item: Option<string>): string => item?.label ?? '';
  readonly matcher: TuiStringMatcher<Option<string>> = (item, search) => {
    return item.label.toLowerCase().includes(search.toLowerCase());
  };
}
