import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  firestore: Firestore = inject(Firestore);

  constructor() {
    
  }

  getGamesRef() {
    return collection(this.firestore, 'game-instances')
  }

  getDocRef(docId: string) {
    return doc(this.getGamesRef(), docId);
  }
}
