import { Component, inject } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {
  appComponent: AppComponent = inject(AppComponent);
}
