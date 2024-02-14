import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { GameService } from '../services/game.service';
import { PlayerComponent } from '../player/player.component';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  gameService = inject(GameService);
  currentCard: string = '';
  cardTaken: boolean = false;

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.gameService.players = [];
    this.fillStack();
    shuffle(this.gameService.stack);
    this.gameService.playedCards = [];
    this.gameService.currentPlayer = 0;
  }

  fillStack() {
    for (let i = 1; i < 14; i++) {
      this.gameService.stack.push(`ace_${i}`);
      this.gameService.stack.push(`clubs_${i}`);
      this.gameService.stack.push(`diamonds_${i}`);
      this.gameService.stack.push(`hearts_${i}`);
    }
  }

  takeCard() {
    if (!this.cardTaken) {
      let poppedCard = this.gameService.stack.pop();
      if (poppedCard !== undefined) {
        this.currentCard = poppedCard;
        this.cardTaken = true;
        setTimeout(() => {
          this.gameService.playedCards.push(this.currentCard);
          this.cardTaken = false;
        }, 1000);
      }
    }
  }
}


function shuffle(array: string[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}