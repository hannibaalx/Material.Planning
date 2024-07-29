import { EoExistingDash8 } from './../../models/eo-existing-dash8';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EoPlanner } from './../../models/eo-planner';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup} from '@angular/forms';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { EcoService } from 'src/app/service/eco.service';

interface ChildNode {
  INDEX?: number;
  ME_PART_NUMBER_USED: string;
  // PRIME_MPN: string;
  // QTY_REQ: number;
  // REQD_IND: boolean;
  // KEYWORD_DESCRIPTION: string;  
  CHILDREN?: ChildNode[];
}

interface FlatNode {
  EXPANDABLE: boolean;
  LEVEL: number;  
  ME_PART_NUMBER_USED: string;
  PRIME_MPN: string;
  QTY_REQ: number;
  REQD_IND: boolean;
  KEYWORD_DESCRIPTION: string;  
 }

@Component({
  selector: 'app-area51',
  templateUrl: './area51.component.html',
  styleUrls: ['./area51.component.css']
})
export class Area51Component implements OnInit {
  sbOpened: boolean = false;
  planners$: Observable<EoPlanner[]>;
  public plannerObj: User;
  userDisplayName: string = "";
  userFirstName: string = "";
  userLastName: string = "";
  nullchk: string = "";
  public tabindex: number;
  public cardContent1: string;
  public cardContent2: string;
  public blnEditCard: boolean[] = [true, true];
  public blnHideEdit: boolean[] = [false, false];
  public blnHideOK: boolean[] = [true, true];
  eoExistingDash8$: Observable<EoExistingDash8>;
  eoExistingDash8: EoExistingDash8[] = [];
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<ChildNode, any>;
  dataSource: MatTreeFlatDataSource<ChildNode, any>;
  ourTuple: [number, boolean, string, boolean, string];

  dynamicForm: FormGroup;

  constructor(
    private ecoService: EcoService, 
    private fb: FormBuilder
  ) {
    this.treeControl = new FlatTreeControl<FlatNode>(
      node => node.LEVEL,
      node => node.EXPANDABLE
    );
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      node => node.LEVEL,
      node => node.EXPANDABLE,
      node => node.CHILDREN
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
    
  }
  
  private transformer = (node: ChildNode, LEVEL: number) => {
    console.log();
    return {
      INDEX: node.INDEX,
      EXPANDABLE: !!node.CHILDREN && node.CHILDREN.length > 0,
      ME_PART_NUMBER_USED: node.ME_PART_NUMBER_USED,
      LEVEL      
      // PRIME_MPN: node.PRIME_MPN,
      // QTY_REQ: node.QTY_REQ,
      // REQD_IND: node.REQD_IND,
      // KEYWORD_DESCRIPTION: node.KEYWORD_DESCRIPTION      
    };
  };

  ngOnInit() {
    this.ecoService.getExistingDash8Step2('03-0501-8-0022').subscribe(data => {
      this.eoExistingDash8 = data;
      //this.dataSource.data = this.getExistingDash8Nodes();
      this.dataSource.data = data;
      this.getExistingDash8Nodes();
    });
    this.nullchk = "blah blah";
    this.ourTuple = [5, true, "just a string", false, "another usless string"];
  }

  editCardContent(index: number) {
    this.blnHideEdit[index] = true;
    this.blnHideOK[index] = false;
    this.blnEditCard[index] = false;
  }

  saveCard(index: number) { 
    this.blnHideEdit[index] = false;
    this.blnHideOK[index] = true;
    this.blnEditCard[index] = true;
  }

  log(state: string) {
    console.log(state);  
  }

  private getExistingDash8Nodes(): ChildNode[] {
    const formArr = this.fb.array([]);
    
    const map = this.eoExistingDash8.map((_existingDash8: EoExistingDash8, i) => {
      formArr.push(this.fb.group({
        INDEX: i,
        ME_PART_NUMBER_USED: _existingDash8.ME_PART_NUMBER_USED,
        PRIME_MPN: _existingDash8.PRIME_MPN,
        QTY_REQ: _existingDash8.QTY_REQ,
        REQD_IND: _existingDash8.REQD_IND,
        KEYWORD_DESCRIPTION: _existingDash8.KEYWORD_DESCRIPTION
        //fcAlternativeMeDetails: new FormArray([])
      }))
      return {
        INDEX: i,
        ME_PART_NUMBER_USED: _existingDash8.ME_PART_NUMBER_USED,
        CHILDREN: [
          {
            INDEX: i,
            ME_PART_NUMBER_USED: `${_existingDash8.ME_PART_NUMBER_USED}-form`,
            PRIME_MPN: `${_existingDash8.PRIME_MPN}`,
            QTY_REQ: `${_existingDash8.QTY_REQ}`,
            REQD_IND: `${_existingDash8.REQD_IND}`,
            KEYWORD_DESCRIPTION: `${_existingDash8.KEYWORD_DESCRIPTION}`
          },
        ]
      };
    });

    this.dynamicForm = this.fb.group({
      arr: formArr
    })
    console.log(this.dynamicForm);
    return map;
    // this.addAlternativeMeDetail();

    //   ) this.fb.group({
    //   index: [],
    //   me_part_number: [null, Validators.required],
    //   prime_mpn: [null],
    //   qty: [1],
    //   commments: [null],
    //   part_requirement: [false],
    //   fcAlternativeMeDetails: new FormArray([])
    // });
    // this.addAlternativeMeDetail();
    // )

    // console.log(this.dynamicForm);

    // return this.dynamicForm;
  }

  public hasChild = (_: number, node: FlatNode) => node.EXPANDABLE;

  // addAlternativeMeDetail() {
  //   const fcAlternativeMeDetails = this.df.fcAlternativeMeDetails as FormArray;
  //   fcAlternativeMeDetails.push(this.fb.group({
  //     fcParentMeNumber: [''],
  //     fcPrimeMpn: [''],
  //     fcQty: [1],
  //     fcPartRequirement: [false],
  //     fcComment: ['']
  //   }))
  // }

  get df() {
    return this.dynamicForm;
  }

  dummyfunction() {
    console.log("blah blah");
  }

  // get fcameds() {
  //   return this.df.fcAlternativeMeDetails as FormArray;
  // }
}
