import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  private config: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private zone: NgZone) {
    this.config = new MatSnackBarConfig();
    this.config.panelClass = ["snackbar-container"];
    this.config.verticalPosition = "bottom";
    this.config.horizontalPosition = "center";
    this.config.duration = 4000;
  }

  error(message: string) {
    this.config.panelClass = ["snackbar-container"];
    this.config.horizontalPosition = "center";
    this.show(message);
  }

  success(message: string) {
    this.config.panelClass = ["snackbar-container"];
    this.config.horizontalPosition = "center";
    this.show(message);
  }

  warning(message: string) {
    this.config.panelClass = ["snackbar-container"];
    this.config.horizontalPosition = "center";
    this.show(message);
  }

  private show(message: string, config?: MatSnackBarConfig) {
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, "close", config );
    });
  }
}