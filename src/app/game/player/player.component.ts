import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input() playerName: string = '';
  @Input() playerActive: boolean = false;
  @Input() playerId: number = 0;
  @Input() editable = true;
  @Output() deletePlayerEvent = new EventEmitter<number>();
  @Output() editPlayerEvent = new EventEmitter<{ index: number, newName: string }>();

  borderColorActive: string = 'rgb(22, 187, 22)';
  borderColorInactive: string = 'gray';

  deletePlayer(playerId: number) {
    this.deletePlayerEvent.emit(playerId);
  }

  saveName(newName: string) {
    if (newName.trim() !== '') {
        this.editPlayerEvent.emit({index: this.playerId, newName: newName});
    }
}
}
