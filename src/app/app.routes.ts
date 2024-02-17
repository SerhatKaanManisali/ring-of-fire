import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    {path: 'game/:id', component: GameComponent},
    {path: '', component: StartScreenComponent}
];
