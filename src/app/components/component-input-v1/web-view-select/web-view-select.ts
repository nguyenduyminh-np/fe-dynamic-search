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

import { TuiStringMatcher } from '@taiga-ui/cdk';
import { WebViewOption } from '../../../core/models/common.model';

@Component({
  standalone: true,
  selector: 'app-web-view-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiChevron,
    TuiDataListWrapper,
    TuiComboBox,
    TuiFilterByInputPipe,
  ],
  templateUrl: './web-view-select.html',
  styleUrl: './web-view-select.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class WebViewSelect {
  @Input() options: readonly WebViewOption[] = [];
  @Input() label = 'Hiển thị giao diện Web';
  @Input() placeholder = '';

  readonly stringify = (item: WebViewOption): string => item?.label ?? '';
  readonly matcher: TuiStringMatcher<WebViewOption> = (item, search) => {
    return item.label.toLowerCase().includes(search.toLowerCase());
  };
}
