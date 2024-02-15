import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-add-player-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogClose, MatDialogActions, MatDialogTitle],
  templateUrl: './add-player-dialog.component.html',
  styleUrl: './add-player-dialog.component.scss'
})
export class AddPlayerDialogComponent {

  name: string = '';

  constructor (public dialogRef: MatDialogRef<AddPlayerDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}