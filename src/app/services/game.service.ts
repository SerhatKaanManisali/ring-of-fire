import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  firestore: Firestore = inject(Firestore);

  unsub;

  players: string[] = [];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;

  constructor() {
    this.unsub = onSnapshot(this.getDocRef('hDRcqiWYTMQfTy05RAlP'), (game) => {
      console.log(game.data());
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