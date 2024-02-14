import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  players: string[] = ['Spieler1', 'Spieler2', 'Spieler3'];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;

  constructor() { }
}