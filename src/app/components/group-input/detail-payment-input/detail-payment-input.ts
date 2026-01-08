import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';

import { CurrencyCodeSelect } from '../../currency-code-select/currency-code-select';
import { MessageStandardSelect } from '../../message-standard-select/message-standard-select';
import { ChannelStatusSelect } from '../../channel-status-select/channel-status-select';
import { ParaStatusSelect } from '../../para-status-select/para-status-select';
import { WebViewSelect } from '../../web-view-select/web-view-select';
import { ActiveStatusSelect } from '../../active-status-select/active-status-select';
import {
  ActiveStatus,
  ChannelStatus,
  CurrencyCode,
  ParaStatusOption,
  WebViewOption,
  YesNoOption,
} from '../../../shared/util/payment-channel-create.util';

@Component({
  standalone: true,
  selector: 'app-detail-payment-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyCodeSelect,
    MessageStandardSelect,
    ChannelStatusSelect,
    ParaStatusSelect,
    WebViewSelect,
    ActiveStatusSelect,
  ],
  templateUrl: './detail-payment-input.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class DetailPaymentInput {
  @Input() msgStandardOptions: readonly string[] = [];
  @Input() currencyCodeOptions: readonly CurrencyCode[] = [];
  @Input() channelStatusOptions: readonly ChannelStatus[] = [];
  @Input() paraStatusOptions: readonly ParaStatusOption[] = [];
  @Input() webViewOptions: readonly WebViewOption[] = [];
  @Input() activeStatusOptions: readonly ActiveStatus[] = [];
}
