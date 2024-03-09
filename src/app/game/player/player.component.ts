import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input()playerName: string = '';
  @Input()playerActive: boolean = false;
  @Input()playerId: number = 0;
  @Output() deletePlayerEvent = new EventEmitter<number>();

  borderColorActive:string = 'rgb(22, 187, 22)';
  borderColorInactive:string = 'gray';

  deletePlayer(playerId: number) {
    this.deletePlayerEvent.emit(playerId);
  }
}
