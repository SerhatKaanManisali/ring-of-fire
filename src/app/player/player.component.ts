import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input()playerName = '';
  @Input()playerActive = false;

  borderColorActive:string = 'rgb(22, 187, 22)';
  borderColorInactive:string = 'gray';
}
