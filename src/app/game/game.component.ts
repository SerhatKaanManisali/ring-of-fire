import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit, inject, HostListener } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { CardInfoComponent } from './card-info/card-info.component';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatSidenavModule } from "@angular/material/sidenav";


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, CardInfoComponent, MatSidenavModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  route: ActivatedRoute = inject(ActivatedRoute);
  windowWidth: number = window.innerWidth;


  unsubGame: Function | undefined;
  firstInstance: boolean = true;
  currentCard: string = '';
  cardTaken: boolean = false;
  players: string[] = [];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;


  constructor() { }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }


  ngOnInit(): void {
    this.newGame();
    this.saveGameState();
    this.getGameState();
  }


  newGame() {
    this.fillStack();
    shuffle(this.stack);
    this.playedCards = [];
    this.currentPlayer = 0;
    this.firstInstance = false;
  }


  fillStack() {
    for (let i = 1; i < 14; i++) {
      this.stack.push(`ace_${i}`);
      this.stack.push(`clubs_${i}`);
      this.stack.push(`diamonds_${i}`);
      this.stack.push(`hearts_${i}`);
    }
  }


  async takeCard() {
    if (!this.cardTaken && this.players.length !== 0) {
      let poppedCard = this.stack.pop();
      if (poppedCard !== undefined) {
        this.currentCard = poppedCard;
        this.cardTaken = true;
        await this.saveGameState();
        this.pickNextPlayer();
        this.addToPlayedStack();
      }
    }
  }


  pickNextPlayer() {
    this.currentPlayer++;
    this.currentPlayer = this.currentPlayer % this.players.length;
  }


  deletePlayer(playerId: number) {
    if (playerId !== -1) {
      this.players.splice(playerId, 1);
      console.log(this.players);
    }
  }


  addToPlayedStack() {
    setTimeout(() => {
      this.playedCards.push(this.currentCard);
      this.cardTaken = false;
      this.saveGameState();
    }, 1500);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddPlayerDialogComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0)
        this.players.push(name);
      this.saveGameState();
    });
  }


  getGameState() {
    this.unsubGame = onSnapshot(this.getDocRef(), (gameState: any) => {
      this.players = gameState.data().players;
      this.stack = gameState.data().stack;
      this.playedCards = gameState.data().playedCards;
      this.currentPlayer = gameState.data().currentPlayer;
      this.currentCard = gameState.data().currentCard;
      this.cardTaken = gameState.data().cardTaken;
      this.firstInstance = gameState.data().firstInstance;
    });
  }


  async saveGameState() {
    await updateDoc(this.getDocRef(), this.gameAsJson());
  }


  gameAsJson() {
    return {
      players: this.players,
      stack: this.stack,
      playedCards: this.playedCards,
      currentPlayer: this.currentPlayer,
      currentCard: this.currentCard,
      cardTaken: this.cardTaken,
      firstInstance: this.firstInstance
    };
  }


  getGameId() {
    return this.route.snapshot.params['id']
  }


  getGamesRef() {
    return collection(this.firestore, 'games');
  }


  getDocRef() {
    return doc(this.getGamesRef(), this.getGameId());
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