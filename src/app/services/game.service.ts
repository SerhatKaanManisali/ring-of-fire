import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  firestore: Firestore = inject(Firestore);

  players: string[] = [];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;

  unsub;

  constructor() {
    this.unsub = onSnapshot(this.getDocRef('Ch00nlubg7CGokZa7QuM'), (game) => {console.log(game.data());
    });
  }


  getGamesRef() {
    return collection(this.firestore, 'games');
  }


  getDocRef(docId: string) {
    return doc(this.getGamesRef(), docId);
  }
}