import { CommonModule, Location } from '@angular/common';
import { Component, Injectable, OnInit, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { CardInfoComponent } from './card-info/card-info.component';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatSidenavModule } from "@angular/material/sidenav";
import { animate, state, style, transition, trigger } from '@angular/animations';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, CardInfoComponent, MatSidenavModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [trigger('fadeInOut', [
    state('closed',
      style({
        opacity: 0
      })
    ),
    state('in',
      style({
        opacity: 1
      })
    ),
    transition('void => *', [style({ opacity: 0 }), animate('0.5s ease-in-out')]),
    transition('* => void', [animate('0.5s ease-in-out'), style({ opacity: 0 }),]),
  ])]
})
export class GameComponent implements OnInit {

  firestore: Firestore = inject(Firestore);
  dialog: MatDialog = inject(MatDialog);
  route: ActivatedRoute = inject(ActivatedRoute);
  location: Location = inject(Location);
  windowWidth: number = window.innerWidth;


  messageSent: boolean = false;
  unsubGame: Function | undefined;
  firstInstance: boolean = true;
  currentCard: string = '';
  cardTaken: boolean = false;
  players: string[] = [];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;

  @ViewChild('playerContainer') playerContainer!: ElementRef;
  @ViewChild('sidenavUi') sidenavUi!: ElementRef;


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
    if (playerId > -1 && playerId < this.players.length) {
      this.players.splice(playerId, 1);
    }
    if (playerId <= this.currentPlayer) {
      this.currentPlayer--;
    }
    if (this.players.length > 0) {
      this.pickNextPlayer();
    }
    this.saveGameState();
  }


  editPlayer({ index, newName }: { index: number, newName: string }) {
    if (index > -1 && index < this.players.length && newName.trim() !== '') {
      this.players[index] = newName;
    }
    this.saveGameState();
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

  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    this.messageConfirmation();
  }

  messageConfirmation() {
    this.messageSent = true;
    setTimeout(() => this.messageSent = false, 3000);
  }
}


function shuffle(array: string[]) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex > 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}