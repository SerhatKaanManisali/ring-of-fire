import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { Router } from '@angular/router';
import { addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, GameComponent],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  gameComponent: GameComponent = inject(GameComponent);
  router: Router = inject(Router);


  async addGame() {
    await addDoc(this.gameComponent.getGamesRef(), this.gameComponent.gameAsJson()).then(
      (gameInfo) => {
        this.gameComponent.firstInstance = true;
        this.router.navigateByUrl('/game/' + gameInfo.id)
      }
    );
  }
}
