import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-page',
  imports: [],
  templateUrl: './unauthorized-page.html',
  styleUrl: './unauthorized-page.css',
})
export class UnauthorizedPage {
  private location = inject(Location);
  private router = inject(Router);

  goBack(): void {
    this.location.back();
  }
  goHome(): void {
    this.router.navigateByUrl('/');
  }
}
