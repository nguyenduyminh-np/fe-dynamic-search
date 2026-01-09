import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources-not-found-page',
  standalone: true,
  imports: [],
  templateUrl: './resources-not-found-page.html',
  styleUrl: './resources-not-found-page.css',
})
export class ResourcesNotFoundPage {
  private location = inject(Location);
  private router = inject(Router);

  goBack(): void {
    this.location.back();
  }
  goHome(): void {
    this.router.navigateByUrl('/');
  }
}
