import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { CardInfoComponent } from './card-info/card-info.component';
import { ActivatedRoute } from '@angular/router';
import { Firestore, addDoc, collection, doc, onSnapshot } from '@angular/fire/firestore';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, CardInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  route: ActivatedRoute = inject(ActivatedRoute);


  unsubGame: Function | undefined;
  currentCard: string = '';
  cardTaken: boolean = false;


  players: string[] = [];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;


  constructor() { }


  async ngOnInit(): Promise<void> {
    this.newGame();
    this.getGameState();
    // await this.gameService.addGame();
  }


  newGame() {
    this.fillStack();
    shuffle(this.stack);
    this.playedCards = [];
    this.currentPlayer = 0;
  }


  fillStack() {
    for (let i = 1; i < 14; i++) {
      this.stack.push(`ace_${i}`);
      this.stack.push(`clubs_${i}`);
      this.stack.push(`diamonds_${i}`);
      this.stack.push(`hearts_${i}`);
    }
  }


  takeCard() {
    if (!this.cardTaken && this.players.length !== 0) {
      let poppedCard = this.stack.pop();
      if (poppedCard !== undefined) {
        this.currentCard = poppedCard;
        this.cardTaken = true;
        this.pickNextPlayer();
        this.addToPlayedStack();
      }
    }
  }


  pickNextPlayer() {
    this.currentPlayer++;
    this.currentPlayer = this.currentPlayer % this.players.length;
  }


  addToPlayedStack() {
    setTimeout(() => {
      this.playedCards.push(this.currentCard);
      this.cardTaken = false;
    }, 1500);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddPlayerDialogComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0)
        this.players.push(name);
    });
  }


  getGameId() {
    return this.route.snapshot.params['id']
  }


  getGameState() {
    this.unsubGame = onSnapshot(this.getDocRef(this.getGameId()), (game) => {
      
    });
  }

  async addGame() {
    await addDoc(this.getGamesRef(), this.gameAsJson());
  }


  gameAsJson() {
    return {
      players: this.players,
      stack: this.stack,
      playedCards: this.playedCards,
      currentPlayer: this.currentPlayer
    };
  }


  getGamesRef() {
    return collection(this.firestore, 'games');
  }


  getDocRef(docId: string) {
    return doc(this.getGamesRef(), docId);
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