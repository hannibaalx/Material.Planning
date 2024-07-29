import { EoManageAlternativePartStep2Child } from './../../../../models/eo-manage-alternative-part-step2-child';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { EoExistingDash8 } from 'src/app/models/eo-existing-dash8';
import { EoManageAlternativePartStep2 } from 'src/app/models/eo-manage-alternative-part-step2';
import { EcoService } from 'src/app/service/eco.service';
import { UserService } from 'src/app/service/user.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-eo-manage-alternative-part-dash8',
  templateUrl: './eo-manage-alternative-part-dash8.component.html',
  styleUrls: ['./eo-manage-alternative-part-dash8.component.css']
})
export class EoManageAlternativePartDash8Component implements OnInit {
  dynamicForm: FormGroup;
  altForm: FormGroup;
  filteredDash8$: Observable<string[]>;
  eoExistingDash8$: Observable<EoExistingDash8[]>
  hideDash8List: boolean;
  currentUser: string = "";
  mePartNumberUsed = new FormControl();
  mePartNumberList: EoExistingDash8[] = [];
  filteredMePartNumberUsed: string[] = [];
  fcSearchDash8: FormControl;
  // fcMePartNumberUsed: FormControl;
  // fcPrimeMpn: FormControl;
  // fcQtyReq: FormControl;
  // fcReqdInd: FormControl;
  // fcKeywordDescription: FormControl;
  _parents: FormArray;
  _children: FormArray;

  constructor(
    private ecoService: EcoService,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    //this.currentUser = this.userService.getUser().displayName;

    this.filteredDash8$ = this.mePartNumberUsed.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    
    this.reactiveDynamicEditForm();
  }

  private _filter(value: string): string[] { 
    const filterValue = value.toLowerCase();
    return this.filteredMePartNumberUsed.filter(option => option["ME_PART_NUMBER_USED"].toLowerCase().includes(filterValue));
  }

  get altd8() {
    return this.altForm.controls;
  }

  get altd8parents() {
    return this.altd8.parents as FormArray;
  }

  altd8parentschildren(index): FormArray {
    return this.altd8parents.at(index).get("CHILDREN") as FormArray;
   }

  reactiveDynamicEditForm() {
    this.altForm = this.fb.group({
      fcSearchDash8: [null, Validators.required],
      parents: this.fb.array([])
    });
    this._parents = this.altd8parents;
    //this._children = this.altd8parentschildren;
  }

  get parents(): FormArray { 
    return this.altForm.get("parents") as FormArray
  }

  alternativeParts() { 
    return this.altForm.get("CHILDREN") as FormArray
  }


  removeAlternativePart(index: number) { 
    this.alternativeParts().removeAt(index);
  }

  parentChildren(index: number): FormArray {
    return this.altd8parents.at(index).get("parents") as FormArray
  }

  newAlternativePart(): FormGroup { 
    return this.fb.group({
      c_ID: '',
      c_ME_PART_NUMBER_USED: '',
      c_DASH_8: '',
      c_ALTERNATIVE_ME_PART_NUMBER_USED: '',
      c_PRIME_MPN: '',
      c_QTY_REQ: 0,
      c_REQD_IND: false,
      c_COMMENTS: ''
    })
  }
  
  addAlternativePart() { 
    this.alternativeParts().push(this.newAlternativePart())
  }

  removeParentChild(index: number, childIndex: number) { 
    this.parentChildren(index).removeAt(childIndex);
  }

  // addParent(){
  //   const parents = this.altd8parents;
  //   return parents.push(this.fb.group({
  //     DASH_8: [{ value:'', disabled: true }],
  //     ME_PART_NUMBER_USED: [{ value:'', disabled: true }],
  //     PRIME_MPN: [{ value:'', disabled: true }],
  //     QTY_REQ: [{ value: 1, disabled: true }],
  //     REQD_IND: [{ value: false, disabled: true }],
  //     KEYWORD_DESCRIPTION: [{ value: '', disabled: true }],
  //     CHILDREN: this.fb.array([])
  //     //CHILDREN: [this.fb.array([{c_ID: 0, c_DASH_8: '', c_ME_PART_NUMBER_USED: '', c_ALTERNATIVE_ME_PART_NUMBER_USED: '', c_QTY_REQ: 0, c_REQD_IND: '', c_PLANNER_NAME: '', c_COMMENTS: ''}])]
  //   }))
  // } 

  autoSearch(value, type: string) {
    switch (type) {
      case "dash8":
        if (value.target.value.length > 2) {
          this.filteredDash8$ = this.ecoService.getManageAlternativeDash8(value.target.value);
          this.hideDash8List = true;
        }
        else {
          this.hideDash8List = false;
        }
        break;
    }
  }

  getExistingDash8Detail(dash8: string) {
    this.ecoService.getExistingDash8Step2(dash8)
      .subscribe(data => {
        data.forEach(x => {
          this.mePartNumberList.push(x)
        });
      });
  }

  showMePartNumberUsedElements(_ME_PART_NUMBER_USED: string) {
    //_ME_PART_NUMBER_USED is selected 
    // console.log(_ME_PART_NUMBER_USED);
    //finds the selected element object
    // console.log(this.mePartNumberList.find(val => val.ME_PART_NUMBER_USED == _ME_PART_NUMBER_USED));
    let selectedObj = this.mePartNumberList.find(val => val.ME_PART_NUMBER_USED == _ME_PART_NUMBER_USED);

    let _parent = new EoManageAlternativePartStep2();
    
    _parent.DASH_8 = selectedObj.DASH_8;
    _parent.ME_PART_NUMBER_USED = selectedObj.ME_PART_NUMBER_USED;
    _parent.PRIME_MPN = selectedObj.PRIME_MPN;
    _parent.QTY_REQ = selectedObj.QTY_REQ;
    _parent.REQD_IND = (selectedObj.REQD_IND == 'Y') ? true : false;
    _parent.KEYWORD_DESCRIPTION = selectedObj.KEYWORD_DESCRIPTION;
    _parent.CHILDREN = [];
    this.altd8parents.push(this.fb.group(_parent));
    // console.log(this.altd8parents);
  }
  
  removeParent(index: number) {
    this.mePartNumberUsed.setValue("");
    this.altd8parents.removeAt(index);
  }

  getExistingChildren(_parent: FormGroup, index: number) {
    // console.log(_parent);
    // console.log(index);

    let _child = new EoManageAlternativePartStep2Child;

    //get existing children - existing children will have an id, new children will not
    this.ecoService.getExistingMePartNumberChildren(_parent.value.DASH_8, _parent.value.ME_PART_NUMBER_USED)
      .subscribe(data => {
        data.forEach(x => {
          _child.c_ID = x.c_ID;
          _child.c_DASH_8 = x.c_DASH_8;
          _child.c_ME_PART_NUMBER_USED = x.c_ME_PART_NUMBER_USED;
          _child.c_ALTERNATIVE_ME_PART_NUMBER_USED = x.c_ALTERNATIVE_ME_PART_NUMBER_USED;
          _child.c_PRIME_MPN = x.c_PRIME_MPN;
          _child.c_QTY_REQ = x.c_QTY_REQ;
          _child.c_REQD_IND = x.c_REQD_IND;
          _child.c_COMMENTS = x.c_COMMENTS;
          //_parent.controls.CHILDREN.value.push(_child);
        })
        //_parent.CHILDREN.push(data);
      });
   }

  submitDynamicForm(something: any) { }

  // addStepContent(data: EoExistingDash8) {
  //   this.ecoService.getManageEoNoDash8FormDataStep3(data.DASH_8)
  //     .subscribe(detailData => {
  //       let items = new EoManageAlternativePartStep2()
  //       detailData.forEach(x => {
  //         items.DASH_8 = x.d,
  //         items.fcMePartNumberEdit = x.fcMePartNumberEdit,
  //         items.fcPrimeMpnEdit = x.fcPrimeMpnEdit,
  //         items.fcQtyEdit = x.fcQtyEdit,
  //         items.fcCommentEdit = x.fcCommentEdit,
  //         items.fcPartRequirementEdit = x.fcPartRequirementEdit.toString().toLowerCase() == 'true'
  //       this.formDataEdit.push(this.fbEdit1.group(items))
  //       })
  //       console.log(this.formDataEdit);
  //       this.deForm.patchValue({
  //         fcSearchEoNumberEdit: data.EO_NUMBER,
  //         fcEoNumberEdit: data.EO_NUMBER,
  //         fcEoDescEdit: data.EO_DESC,
  //         fcEoCommentEdit: data.NEW_EO_COMMENTS,
  //         fcAircraftCountEdit: data.AIRCRAFT_COUNT,
  //         fcBomDetailsEdit: this.formDataEdit.value
  //       })
  //       console.log(this.deForm);
  //     })
  // };


}
