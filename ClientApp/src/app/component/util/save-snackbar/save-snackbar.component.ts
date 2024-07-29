import { Component, OnInit, Input } from '@angular/core';
import { SaveSnackbar } from 'src/app/models/save-snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-snackbar',
  templateUrl: './save-snackbar.component.html',
  styleUrls: ['./save-snackbar.component.css']
})
export class SaveSnackbarComponent implements OnInit {

  @Input() receivedSaveEvent: SaveSnackbar;

  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    
  }

  receiveSaveEvent($event: SaveSnackbar) { 
    this.receivedSaveEvent = $event;

    if (this.receivedSaveEvent != null || this.receivedSaveEvent != undefined) {
      if (this.receivedSaveEvent.Response > 0) {  //open success snackbar
        if (this.receivedSaveEvent.Message.length == 0)
          this.snackBar.open("Hurray!! Save was successful!", 'Close', { duration: 3000 });
        else
          this.snackBar.open(this.receivedSaveEvent.Message, "Close", { duration: 3000 });
      }
      else{ //open failed snackbar
        if (this.receivedSaveEvent.Message.length == 0)
          this.snackBar.open("There was a problem saving.  Contact Material Planning.", 'Close');
        else
          this.snackBar.open(this.receivedSaveEvent.Message, "Close");
      }     
    }
  }
}
