import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper } from '@taiga-ui/kit';
import { YesNoOption } from '../../shared/util/payment-channel-create.util';

@Component({
  standalone: true,
  selector: 'app-web-view-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiChevron,
    TuiDataListWrapper,
  ],
  templateUrl: './web-view-select.html',
  styleUrl: './web-view-select.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class WebViewSelect {
  @Input() options: readonly number[] = [];
}
