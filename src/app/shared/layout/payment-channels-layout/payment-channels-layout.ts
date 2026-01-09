import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-payment-channels-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class PaymentChannelsLayout {}
