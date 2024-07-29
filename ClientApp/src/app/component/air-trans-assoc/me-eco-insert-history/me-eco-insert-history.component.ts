import { PartService } from './../../../service/part.service';
import { MeEcoComments } from 'src/app/models/me-eco-comments';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { PlannerService } from 'src/app/service/planner.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from 'src/app/models/user';
//import { Router } from '@angular/router';
import { PartNumber } from 'src/app/models/partnumber';

@Component({
  selector: 'app-me-eco-insert-history',
  templateUrl: './me-eco-insert-history.component.html',
  styleUrls: ['./me-eco-insert-history.component.css']
})
export class MeEcoInsertHistoryComponent implements OnInit {
  form: FormGroup;
  txtComment: FormControl;
  ooNumbers: FormControl;
  plannerName: User;
  fromDialog: string;
  submitted = false;
  public optimalMessage: string = ""; 
  resp: any;
  parts$: PartNumber[];

  constructor(
    private plannerService: PlannerService,
    private partService: PartService,
    //private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MeEcoInsertHistoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any    
  ) {
  this.form = this.fb.group({
    txtComment: ['', Validators.required],
    ooNumbers: [null, [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]] //, Validators.minLength(5)
    });
    
  }

  ngOnInit() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.plannerName = temp;
  }

  get f(){
    return this.form.controls;
  }

  get txtcommentValue() { 
    return this.form.get("txtComment").value;
  }

  get ooNumbersValue() { 
    return this.form.get("ooNumbers").value;
  }


  saveComment() {
    let req = new MeEcoComments();
    switch (this.data.historytype) {
      case "ME":
      case "ECO":
        req.COMMENTS = this.txtcommentValue;
        break;
      case "OO":
        let _optOMessage = this.optimalMessage;
        req.COMMENTS = "Optimal Ownership is: " + this.ooNumbersValue;
        req.OPTIMAL_OWNERSHIP = +this.ooNumbersValue;
        req.ME_PART_NUMBER = this.data.menumber;

        let val = document.getElementById('oo-input') as HTMLFormElement;
        if (val?.value == "N/A" || val?.value == null) { 
          req.COMMENTS = "Optimal Ownership is: " + this.ooNumbersValue;
        }          
        else
          req.COMMENTS = " Optimal Ownership changed from " + val?.value + " to " + this.ooNumbersValue;
        break;
     }    
    req.COMMENT_TYPE = this.data.historytype;
    req.ME_PART_NUMBER = this.data.menumber;
    req.PLANNER_NAME = this.plannerName.display_name;
    req.UPDATE_TIME = new Date();
    req.ID = 0;
    
    let reqobj = req;
   
    if (req.COMMENT_TYPE == 'ME' || req.COMMENT_TYPE == 'ECO' || req.COMMENT_TYPE == 'OO') {
      this.plannerService.insertMeEcoComment(reqobj)
        .subscribe(result => {
        return this.resp = result;
      });
    }
    
    if (req.COMMENT_TYPE == 'OO') {
      this.plannerService.updatePartAttributes(reqobj)
        .subscribe(result => {
          if (location.href.includes((req.ME_PART_NUMBER)))
            location.reload();
          else
            location.assign('/ata/' + req.ME_PART_NUMBER);
        });
    } 
    
    this.closeDialog();
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
    
  closeDialog() { 
    this.dialogRef.close({event: 'close', data: this.fromDialog})
  }
}


