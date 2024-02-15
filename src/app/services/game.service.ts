import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  players: string[] = [];
  stack: string[] = [];
  playedCards: string[] = [];
  currentPlayer: number = 0;

  constructor() { }
}