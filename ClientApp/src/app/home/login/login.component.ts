import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { User } from 'src/app/models/user';
import * as moment from 'moment';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  fromDialog: any;
  date: Date;
  //currentDate = moment.utc(date "-06:00").format("HH:mm:ss");
  @ViewChild('closebtn') closeBtn: MatButton;
  _user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:"" };
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      userId: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
   });
   }

  ngOnInit() {
    // this._user = this.getWithExpiry('userInfo');
    // if (this._user?.employeenumber.length > 0) { 
    //   this.form.controls.userId.setValue(this._user.employeenumber);
    //   this.closeDialog();
    // }
  }

  closeDialog() {
    //this.fromDialog = this.form.controls.userId.value;
    this.fromDialog = [{ id: this.form.controls.userId.value, lastupdatedtime: new Date()}];
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }

  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)

    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

}
