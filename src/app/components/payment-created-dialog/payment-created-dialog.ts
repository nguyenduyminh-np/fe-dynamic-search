import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type TuiDialogContext, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiSelect, TuiSlider } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { PaymentChannel } from '../../core/models/para-payment-channel.model';

@Component({
  standalone: true,
  imports: [
    TuiDataListWrapper,
    TuiSelect,
    TuiSlider,
    TuiTextfield,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './payment-created-dialog.html',
  styleUrls: ['./payment-created-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParaPaymentCreatedDialog {
  public readonly context =
    injectContext<TuiDialogContext<void, PaymentChannel>>();

  protected get data(): PaymentChannel {
    return this.context.data;
  }

  protected close(): void {
    this.context.completeWith();
  }
}
