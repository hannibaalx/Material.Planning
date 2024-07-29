import {Observable,timer} from 'rxjs';
import { EoInventoryReportReq} from './../../../../models/eo-inventory-report-req';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService} from 'src/app/service/user.service';
import { EcoService} from 'src/app/service/eco.service';
import { ManageEoNoDash8Req} from 'src/app/models/manage-eo-no-dash8-req';
import { SaveSnackbar} from 'src/app/models/save-snackbar';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { EoReportService} from 'src/app/service/eo-report.service';
import { EoInventoryReportBomDetail} from 'src/app/models/eo-inventory-report-bom-detail';
import { EoInventoryReport} from 'src/app/models/eo-inventory-report';
import { EoManageEoNoDash8Step2} from 'src/app/models/eo-manage-eo-no-dash8-step2';
import { EoManageEoNoDash8Step3} from 'src/app/models/eo-manage-eo-no-dash8-step3';
import { EoDeleteEoNumberByEoNumberReq} from 'src/app/models/eo-delete-eo-number-by-eo-number-req';
import { EoUpdateEditManageEoNoDash8Req} from 'src/app/models/eo-update-edit-manage-eo-no-dash8-req';
import { User } from 'src/app/models/user';

export class AAErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-eo-manage-no-dash8',
  templateUrl: './eo-manage-no-dash8.component.html',
  styleUrls: ['./eo-manage-no-dash8.component.css']
})
export class EoManageNoDash8Component implements OnInit, OnDestroy {
  dynamicForm: FormGroup;
  deForm: FormGroup;
  matcher = new AAErrorStateMatcher();

  @Output() saveSnackbar = new EventEmitter < SaveSnackbar > ();

  currentUser: string = "";
  submitted: boolean = false;
  hideSpinner: boolean = true;
  hideSaveBtn: boolean = false;
  hideInventoryRptBtn: boolean = true;
  hideInventoryEditRptBtn: boolean = true;
  hideDownloadBtn: boolean = true;
  hideSaveEditBtn: boolean = false;
  hideInventoryRptEditBtn: boolean = true;
  hideDownloadEditBtn: boolean = true;
  filteredEo$: Observable < string[] > ;
  eoDataStep2$: Observable < EoManageEoNoDash8Step2[] > ;
  eoDataStep3$: Observable < EoManageEoNoDash8Step3[] > ;
  stepContent: FormGroup;
  step3bomDetails = new FormArray([]);
  selectable = true;
  removable = true;
  fcSearchEoNumberEdit: FormControl;
  fcEoNumberEdit: FormControl;
  fcEoDescEdit: FormControl;
  fcEoCommentEdit: FormControl;
  fcAircraftCountEdit: FormControl;
  _fcBomDetailsEdit: FormArray;
  hideSpinnerEdit: boolean = true;
  hideSaveBtnEdit: boolean = false;
  hideInventoryRptBtnEdit: boolean = true;
  hideDownloadBtnEdit: boolean = true;

  hideEoNumber: boolean = true;
  hideTable: boolean = true;
  currentDate = moment().format('YYYY-MM-DD, hh:mm');
  fileName: string = 'EO Inventory Report - ' + this.currentDate + '.xlsx';
  eoNumber: string = '';
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };

  partRequirement = [{
      id: 1,
      label: 'AS REQUIRED'
    },
    {
      id: 2,
      label: 'REQUIRED'
    }
  ];

  selectedPartRequirement = [];
  fcPrimeMpn: any;
  fcQty: any;
  fcPartRequirement: any;
  fcComment: any;
  resp: any;
  downloadEoInventoryReport: any;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private fbEdit1: FormBuilder,
    private fbEdit2: FormBuilder,
    private ecoService: EcoService,
    private eoReportService: EoReportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = this.user.display_name;
    
    this.reactiveDynamicForm();
    this.reactiveDynamicEditForm();
  }

  reactiveDynamicForm() {
    this.dynamicForm = this.fb.group({
      fcEoNumber: [null, Validators.required],
      fcEoDesc: [null],
      fcEoComment: [null],
      fcAircraftCount: [1],
      fcBomDetails: new FormArray([])
    });
    this.addBomDetail();
    // console.log(this.dynamicForm.value);
  }

  reactiveDynamicEditForm() {
    this.deForm = this.fbEdit1.group({
      fcSearchEoNumberEdit: [null, Validators.required], 
      fcEoNumberEdit: [null],
      fcEoDescEdit: [null],
      fcEoCommentEdit: [null],
      fcAircraftCountEdit: [1],
      fcBomDetailsEdit: this.fbEdit1.array([])
    });
    this._fcBomDetailsEdit = this.fcebds;
  }

  get df() {
    return this.dynamicForm.controls;
  }
  get fcbds() {
    return this.df.fcBomDetails as FormArray;
  }

  get def() {
    return this.deForm.controls;
  }

  get fcebds() {
    return this.def.fcBomDetailsEdit as FormArray;
  }

  addBomDetail() {
    const fcBomDetailItems = this.df.fcBomDetails as FormArray;
    fcBomDetailItems.push(this.fb.group({
      fcMePartNumber: [''],
      fcPrimeMpn: [''],
      fcQty: [1],
      fcPartRequirement: [false],
      fcComment: ['']
    }))
  }

  addBomDetailEdit() {
    const fcBomDetailItemsEdit = this.fcebds;
    fcBomDetailItemsEdit.push(this.fbEdit1.group({
      ID: [0],
      fcMePartNumberEdit: [''],
      fcPrimeMpnEdit: [''],
      fcQtyEdit: [1],
      fcPartRequirementEdit: [false],
      fcCommentEdit: ['']
    }))
  }

  removeBomDetail(index: number) {
    this.fcbds.removeAt(index);
  }

  removeEditBomDetail(index: number, id: number) {
    this.ecoService.deleteEoByID(id);
    this.fcebds.removeAt(index);
  }

  submitDynamicForm(dynaForm: NgForm) {
    if (!dynaForm.valid)
      return;

    let manageEoNoDash8Req = new ManageEoNoDash8Req();
    manageEoNoDash8Req.PLANNER = this.currentUser;
    manageEoNoDash8Req.EO_NUMBER = this.dynamicForm.value.fcEoNumber;
    manageEoNoDash8Req.EO_DESC = this.dynamicForm.value.fcEoDesc ? this.dynamicForm.value.fcEoDesc : "";
    manageEoNoDash8Req.NEW_EO_COMMENTS = this.dynamicForm.value.fcEoComment ? this.dynamicForm.value.fcEoComment : "";
    manageEoNoDash8Req.AIRCRAFT_COUNT = +this.dynamicForm.value.fcAircraftCount;

    // console.log(dynaForm.value);
    this.dynamicForm.value.fcBomDetails.forEach(x => {
      manageEoNoDash8Req.ME_PART_NUMBER = x.fcMePartNumber;
      manageEoNoDash8Req.PRIME_MPN = x.fcPrimeMpn;
      manageEoNoDash8Req.QTY = +x.fcQty;
      manageEoNoDash8Req.PART_REQUIREMENT = x.fcPartRequirement ? 'REQUIRED' : 'AS REQUIRED';
      manageEoNoDash8Req.ME_COMMENT = x.fcComment ? x.fcComment : "";
      // console.log(manageEoNoDash8Req);
      this.ecoService.insertManageEoNoDash8(manageEoNoDash8Req)
        .subscribe(result => {
          this.resp = result;
          this.hideSaveBtn = true;
          this.hideInventoryRptBtn = false;
          this.hideDownloadBtn = true;
          //this.dynamicForm.reset();
          this.openSnackBar(this.resp);
          return this.resp = result;
        });
    });
  }

  submitDynamicEditForm(dynaEditForm: NgForm) {
    if (!dynaEditForm.valid)
      return;
    // console.log("saving...")
    // console.log(dynaEditForm);
    let req = new EoUpdateEditManageEoNoDash8Req();
    req.EO_NUMBER = dynaEditForm.form.value.fcEoNumberEdit;
    req.EO_DESC = dynaEditForm.form.value.fcEoDescEdit;
    req.NEW_EO_COMMENTS = dynaEditForm.form.value.fcEoCommentEdit;
    req.AIRCRAFT_COUNT = +dynaEditForm.form.value.fcAircraftCountEdit;
    req.PLANNER = this.currentUser;
    req.BOM_DETAIL = [];
    dynaEditForm.form.value.fcBomDetailsEdit.forEach((x, i) => {
      // console.log("x -> " + i.toString());
      // console.log(x);
      let _BOM_DETAIL = new EoManageEoNoDash8Step3();
      _BOM_DETAIL.ID = x.ID != 0 ? x.ID : 0;
      _BOM_DETAIL.fcMePartNumberEdit = x.fcMePartNumberEdit;
      _BOM_DETAIL.fcPrimeMpnEdit = x.fcPrimeMpnEdit;
      _BOM_DETAIL.fcQtyEdit = +x.fcQtyEdit;
      _BOM_DETAIL.fcPartRequirementEdit = x.fcPartRequirementEdit;
      _BOM_DETAIL.fcCommentEdit = x.fcCommentEdit;
      req.BOM_DETAIL.push(_BOM_DETAIL);
      // console.log("bomdetail -> " + i.toString());
      // console.log(req);
    });
    // console.log("sending final request");
    // console.log(req);
    this.ecoService.updateManageEoNoDash8(req)
      .subscribe(result => {
        this.resp = result;
        this.hideSaveBtnEdit = true;
        this.hideInventoryRptBtnEdit = false;
        this.hideDownloadBtnEdit = true;
        //this.deForm.reset();
        this.openSnackBarUpdate(this.resp);
        return this.resp = result;
      });
  }

  deleteEoNumber(val: string) {
    let req = new EoDeleteEoNumberByEoNumberReq();
    req.EO_NUMBER = val;
    this.ecoService.deleteEoNumber(req)
      .subscribe(result => {
        this.openSnackBarDelete(result);
        this.deForm.reset();
        this.reactiveDynamicEditForm();
      });
  }

  get formData() {
    return <FormArray > this.dynamicForm.get('fcBomDetails');
  }

  get formDataEdit(): FormArray {
    return this.deForm.get('fcBomDetailsEdit') as FormArray;
  }

  openSnackBar(resp: number) {
    if (resp > 0) {
      //open success snackbar
      this.snackBar.open("Hurray!! Save was successful!", 'Close', {
        duration: 3000
      });
    } else {
      //open failed snackbar
      this.snackBar.open("There was a problem saving.  Contact Material Planning.", 'Close');
    }
  }

    openSnackBarUpdate(resp: number) {
    if (resp > 0) {
      //open success snackbar
      this.snackBar.open("Hurray!! Update was successful!", 'Close', {
        duration: 3000
      });
    } else {
      //open failed snackbar
      this.snackBar.open("There was a problem updating.  Contact Material Planning.", 'Close');
    }
  }

  openSnackBarDelete(resp: number) {
    if (resp > 0) {
      //open success snackbar
      this.snackBar.open("Hurray!! Delete was successful!", 'Close', {
        duration: 3000
      });
    } else {
      //open failed snackbar
      this.snackBar.open("There was a problem the eo number.  Contact Material Planning.", 'Close');
    }
  }

  openInventoryReportSnackBar(resp: EoInventoryReport) {
    if (resp) {
      //open success snackbar
      this.snackBar.open("Inventory Report Generated", 'Close', {
        duration: 3000
      });
    } else {
      //open failed snackbar
      this.snackBar.open("There was a problem generating the inventory report.  Contact Material Planning.", 'Close');
    }
    // let _value = new SaveSnackbar();
    // _value.Message = "";
    // _value.Response = resp;
    // this.saveSnackbar.emit(_value);

    //this.sendSaveEvent(_value);
  }

  sendSaveEvent($event: SaveSnackbar) {
    //  this.saveSnackbar.emit($event);
  }

  autoSearch(value, type: string) {
    switch (type) {
      case "eo":
        if (value.target.value.length > 2) {
          this.filteredEo$ = this.ecoService.getManageEoNoDash8EoNumber(value.target.value);
          this.hideEoNumber = true;
        }
        else {
          this.hideEoNumber = false;
        }
        break;
    }
  }

  getManageEoNoDash8FormData(eonumber: string) {
    this.ecoService.getManageEoNoDash8FormDataStep2(eonumber)
      .subscribe(data => {
        data.forEach(x => {
          this.addStepContent(x);
        })
      });
  }

  addStepContent(data: EoManageEoNoDash8Step2) {
    this.ecoService.getManageEoNoDash8FormDataStep3(data.EO_NUMBER)
      .subscribe(detailData => {
        let items = new EoManageEoNoDash8Step3()
        detailData.forEach(x => {
          items.ID = x.ID,
            items.fcMePartNumberEdit = x.fcMePartNumberEdit,
            items.fcPrimeMpnEdit = x.fcPrimeMpnEdit,
            items.fcQtyEdit = x.fcQtyEdit,
            items.fcCommentEdit = x.fcCommentEdit,
            items.fcPartRequirementEdit = x.fcPartRequirementEdit.toString().toLowerCase() == 'true'
          this.formDataEdit.push(this.fbEdit1.group(items))
        })
        // console.log(this.formDataEdit);
        this.deForm.patchValue({
          fcSearchEoNumberEdit: data.EO_NUMBER,
          fcEoNumberEdit: data.EO_NUMBER,
          fcEoDescEdit: data.EO_DESC,
          fcEoCommentEdit: data.NEW_EO_COMMENTS,
          fcAircraftCountEdit: data.AIRCRAFT_COUNT,
          fcBomDetailsEdit: this.formDataEdit.value
        })
        // console.log(this.deForm);
      })
  };

  generateReport(dynaForm: NgForm) {
    if (!dynaForm.valid)
      return;

    this.hideSpinner = false;
    // const pauseCounter = timer(2000);
    // pauseCounter.subscribe(n => {
    //   this.currentUser = this.user.displayName;
    // });

    let inventoryReportReq = new EoInventoryReportReq;
    inventoryReportReq.PLANNER = this.currentUser;
    inventoryReportReq.EO_NUMBER = this.dynamicForm.value.fcEoNumber;
    inventoryReportReq.EO_DESC = this.dynamicForm.value.fcEoDesc;
    inventoryReportReq.NEW_EO_COMMENTS = this.dynamicForm.value.fcEoComment;
    inventoryReportReq.AIRCRAFT_COUNT = +this.dynamicForm.value.fcAircraftCount;
    inventoryReportReq.BOM_DETAILS = [];

    // console.log(dynaForm.value);
    dynaForm.value.fcBomDetails.forEach(x => {
      let _bomDetails = new EoInventoryReportBomDetail;
      _bomDetails.ME_PART_NUMBER = x.fcMePartNumber;
      _bomDetails.PRIME_MPN = x.fcPrimeMpn;
      _bomDetails.QTY = x.fcQty;
      _bomDetails.PART_REQUIREMENT = x.fcPartRequirement ? 'REQUIRED' : 'AS REQUIRED';
      _bomDetails.ME_COMMENT = x.fcComment;
      inventoryReportReq.BOM_DETAILS.push(_bomDetails);
    });

    // console.log(inventoryReportReq);
    this.eoReportService.downloadEoInventoryReport(inventoryReportReq)
      .subscribe(result => {
        this.resp = result;
        //after the api call has returned
        this.hideSpinner = true;
        this.hideSaveBtn = true;
        this.hideInventoryRptBtn = true;
        this.hideDownloadBtn = false;
        this.hideTable = !this.hideTable;
        this.downloadEoInventoryReport = result;
        this.openInventoryReportSnackBar(this.resp);
        return this.resp = result;
      });
  }

    generateReportEdit(dynaEditForm: NgForm) {
    if (!dynaEditForm.valid)
      return;

    this.hideSpinnerEdit = false;

    let inventoryReportReq = new EoInventoryReportReq;
    inventoryReportReq.PLANNER = this.currentUser;
    inventoryReportReq.EO_NUMBER = dynaEditForm.value.fcEoNumberEdit;
    inventoryReportReq.EO_DESC = dynaEditForm.value.fcEoDescEdit;
    inventoryReportReq.NEW_EO_COMMENTS = dynaEditForm.value.fcEoCommentEdit;
    inventoryReportReq.AIRCRAFT_COUNT = +dynaEditForm.value.fcAircraftCountEdit;
    inventoryReportReq.BOM_DETAILS = [];

    // console.log(dynaEditForm.value);
    dynaEditForm.value.fcBomDetailsEdit.forEach(x => {
      let _bomDetails = new EoInventoryReportBomDetail;
      _bomDetails.ME_PART_NUMBER = x.fcMePartNumberEdit;
      _bomDetails.PRIME_MPN = x.fcPrimeMpnEdit;
      _bomDetails.QTY = +x.fcQtyEdit;
      _bomDetails.PART_REQUIREMENT = x.fcPartRequirementEdit ? 'REQUIRED' : 'AS REQUIRED';
      _bomDetails.ME_COMMENT = x.fcCommentEdit;
      inventoryReportReq.BOM_DETAILS.push(_bomDetails);
    });

    // console.log(inventoryReportReq);
    this.eoReportService.downloadEoInventoryReport(inventoryReportReq)
      .subscribe(result => {
        this.resp = result;
        //after the api call has returned
        this.hideSpinnerEdit = true;
        this.hideSaveBtnEdit = true;
        this.hideInventoryRptBtnEdit = true;
        this.hideDownloadBtnEdit = false;
        this.hideTable = !this.hideTable;
        this.dynamicForm.reset();
        this.downloadEoInventoryReport = result;
        this.deForm.reset();
        this.openInventoryReportSnackBar(this.resp);
        return this.resp = result;
      });
  }

  exportReport() {
    /* table id is passed over here */
    let element = document.getElementById('tblInvRepResult');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.hideTable = !this.hideTable;
    this.hideSaveBtn = false;
    this.hideInventoryRptBtn = true;
    this.hideInventoryEditRptBtn = true;
    this.hideDownloadBtn = true;
  }

  ngOnDestroy() {

  }

}
