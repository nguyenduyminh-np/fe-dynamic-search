import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CommonSelectInput } from '../../components/common-select-input/common-select-input';
import { PaymentNameField } from '../../components/component-input-v1/payment-name-field/payment-name-field';
import { PaymentChannelCreateFacade } from '../../core/facades/payment-channel-create.facade';
import {
  Option,
  PaymentChannelNativeSearchCriteria,
} from '../../core/models/common.model';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-dynamic-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonSelectInput,
    PaymentNameField,
    TuiButton,
  ],
  providers: [PaymentChannelCreateFacade],
  templateUrl: './dynamic-search-bar.html',
  styleUrl: './dynamic-search-bar.css',
})
export class DynamicSearchBar implements OnInit {
  @Output()
  readonly search = new EventEmitter<PaymentChannelNativeSearchCriteria>();

  @Output()
  readonly resetSearch = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(PaymentChannelCreateFacade);

  // ===== facade states (signals) =====
  protected readonly isLoading = this.facade.isLoading;

  protected readonly connectionNameOptions = this.facade.connectionNameOptions;
  protected readonly currencyCodeOptions = this.facade.currencyCodeOptions;
  protected readonly msgStandardOptions = this.facade.msgStandardOptions;
  protected readonly channelStatusOptions = this.facade.channelStatusOptions;
  protected readonly paraStatusOptions = this.facade.paraStatusOptions;
  protected readonly webViewOptions = this.facade.webViewOptions;
  protected readonly activeStatusOptions = this.facade.activeStatusOptions;

  protected readonly selectCfg = {
    allowClear: true,
    strict: true,
  };

  // ===== form =====
  protected readonly form = this.fb.group({
    criteria: this.fb.group({
      paymentChannel: this.fb.control<string | null>(null),
      connectionName: this.fb.control<Option<string> | null>(null),
      currencyCode: this.fb.control<Option<string> | null>(null),
      msgStandard: this.fb.control<Option<string> | null>(null),
      channelStatus: this.fb.control<Option<string> | null>(null),
      paraStatus: this.fb.control<Option<number> | null>(null),
      webView: this.fb.control<Option<number> | null>(null),
      activeStatus: this.fb.control<Option<number> | null>(null),
    }),
  });

  protected get criteriaGroup() {
    return this.form.controls.criteria;
  }

  ngOnInit(): void {
    this.facade.init();
  }

  protected resetForm(): void {
    this.form.reset({
      criteria: {
        paymentChannel: null,
        connectionName: null,
        currencyCode: null,
        msgStandard: null,
        channelStatus: null,
        paraStatus: null,
        webView: null,
        activeStatus: null,
      },
    });
  }

  protected resetAndEmit(): void {
    this.resetForm();
    // BA: reset => raw list
    this.resetSearch.emit();
    // reset auto-search thì table sẽ reload trong onResetSearch()
  }

  protected submit(): void {
    const c = this.criteriaGroup.value;

    // Emit raw criteria (Table sẽ sanitize/strip trước khi gọi API)
    const criteria: PaymentChannelNativeSearchCriteria = {
      paymentChannel: c.paymentChannel ?? undefined,
      connectionName: c.connectionName?.value ?? undefined,
      currencyCode: c.currencyCode?.value ?? undefined,
      msgStandard: c.msgStandard?.value ?? undefined,
      channelStatus: c.channelStatus?.value ?? undefined,
      paraStatus: c.paraStatus?.value ?? undefined,
      webView: c.webView?.value ?? undefined,
      activeStatus: c.activeStatus?.value ?? undefined,
    };

    this.search.emit(criteria);
  }
}
