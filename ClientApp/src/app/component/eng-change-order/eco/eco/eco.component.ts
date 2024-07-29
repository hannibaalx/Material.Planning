import { EoSummary } from './../../../../models/eo-summary';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UserService } from './../../../../service/user.service';
import { EcoService } from './../../../../service/eco.service';
import { EcoInfoReq } from './../../../../models/eco-info-req';
import { EcoInfo } from './../../../../models/eco-info';
import { EonumberCommentReq } from './../../../../models/eonumber-comment-req';
import { Dash8CommentReq } from './../../../../models/dash8-comment-req';
import { EoMePart } from 'src/app/models/eo-me-part';
import { AircraftScheduled } from 'src/app/models/aircraft-scheduled';
import { AircraftAccomplished } from 'src/app/models/aircraft-accomplished';
import * as XLSX from 'xlsx'; 
import { ActivatedRoute, Params, Router, UrlTree } from '@angular/router';
import { RefreshTime } from 'src/app/models/refresh-time';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EcoQueueAlertBottomSheetComponent } from './eco-queue-alert-bottom-sheet/eco-queue-alert-bottom-sheet.component';
import * as moment from 'moment';
import { User } from 'src/app/models/user';

declare var $: any;

@Component({
  selector: 'app-eco',
  templateUrl: './eco.component.html',
  styleUrls: ['./eco.component.css'],
})
export class EcoComponent implements OnInit, OnDestroy {
  $: any;
  apopover: string;
  closeResult: string;
  showSearch: boolean = true;
  strShowSearch: string = "display:none;";
  searchDisabled: boolean = true;
  searchType: string;
  plannerName: User;
  currentEoNumber: string = "";
  currentDash8Number: string = "";
  previousEoNumber: string = "";
  resp: any;
  eoInfoHeader: string;
  eoHistoryComment: string;
  eoDash8History: string;
  lastSearched: string;
  hidDescList: boolean = true;
  showSaveval: boolean = false;
  hideLoading: boolean = true;
  searchEoType: UrlTree;

  private searchTerms = new Subject<EcoInfoReq>();
  // ecoInfo$: Observable<EcoInfo[]>;
  ecoInfo$: EcoInfo[];
  eoSummary$: EoSummary[];
  meDetail$: Observable<EoMePart[]>;
  eoplanner$: Observable<string[]>;
  aircraftSched$: Observable<AircraftScheduled[]>;
  aircraftSchedInWork$: Observable<AircraftScheduled[]>;
  aircraftAccomplished$: Observable<AircraftAccomplished[]>;
  refreshtime$: Observable<RefreshTime[]>;
  isLoadingComplete: boolean = true;
  fileName= 'ExcelReport.xlsx';  

  constructor(
    private ecoService: EcoService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar)
  { }

  // setPlanner(name: string) { 
  //   this.plannerName = name;
  // }

  ngOnInit() {
    //this.plannerName = this.userService.getUser().displayName;
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.plannerName = temp.value;

    this.searchEoType = this.router.parseUrl(this.router.url);
    this.isLoadingComplete = false;
    if (this.searchEoType.root.children.primary.segments.length > 1 && this.searchEoType.root.children.primary.segments[1].path == "dash8") {
      this.strShowSearch = "display:block;";
      this.showSearch = true;
      let rdo = document.getElementById('rdoDASH8') as HTMLFormElement;
      rdo.click();
      
      let searchInput = document.getElementById('search-Input') as HTMLFormElement;
      searchInput.value = this.searchEoType.root.children.primary.segments[2].path;
      this.enableSearch('NEW_EO_LIST.DASH_8');
      this.search(searchInput.value);
    }
    else if (this.searchEoType.root.children.primary.segments.length > 1 && this.searchEoType.root.children.primary.segments[1].path == "eonumber") {
      this.strShowSearch = "display:block;";
      this.showSearch = true;
      let rdo = document.getElementById('rdoEONUMBER') as HTMLFormElement;
      rdo.click();

      let searchInput = document.getElementById('search-Input') as HTMLFormElement;
      searchInput.value = this.searchEoType.root.children.primary.segments[2].path;
      this.enableSearch('NEW_EO_LIST.EO_NUMBER');
      if (searchInput.value.length >= 3)
        this.search(searchInput.value);
    }
    else if (this.searchEoType.root.children.primary.segments.length > 1 && this.searchEoType.root.children.primary.segments[1].path == "menumber") {
      this.strShowSearch = "display:block;";
      this.showSearch = true;
      let rdo = document.getElementById('rdoM&E') as HTMLFormElement;
      rdo.click();

      let searchInput = document.getElementById('search-Input') as HTMLFormElement;
      searchInput.value = this.searchEoType.root.children.primary.segments[2].path;
      this.enableSearch('NEW_EO_PARTS_TTL_REQ');
      this.search(searchInput.value);
    }
    else { 
      this.strShowSearch = "display:none;";
      this.showSearch = false; 
    }
    this.isLoadingComplete = true;
    // this.routeSub = this.route.params.subscribe(
    //   (params: Params) => {
    //     if (params['id']) {
    //       //this.menumber = params['id'];
    //     }
    //   });
    
    // this.ecoInfo$ = this.searchTerms.pipe(
    //   debounceTime(300), 
    //   distinctUntilChanged(), // ignore new term if same as previous term
    //   switchMap((ecoInfoReq: EcoInfoReq) =>
    //     this.ecoService.searchNewEOList(ecoInfoReq)
    //     ) // switch to new search observable each time the term changes
    // );
    //this.apopover = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ullamcorper odio in interdum feugiat. Aenean egestas volutpat eleifend. Curabitur urna velit, viverra eu ante nec, consequat condimentum odio. Sed turpis eros, ultricies sit amet gravida non, consectetur a lorem. Etiam maximus dolor sem, vel accumsan nibh pellentesque vel. Cras ut felis nec ligula consequat sollicitudin. Proin eget ligula in ante scelerisque finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam tincidunt, elit non hendrerit consequat, dolor sem auctor sem, sit amet ornare orci nulla a tortor. Aliquam erat volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec dapibus dolor a nulla convallis condimentum id vel justo. In vulputate tellus velit, eget semper ligula sagittis ac. Curabitur convallis massa dui, ut ultrices tellus ultricies non. Vivamus a aliquam massa. Fusce interdum, quam eget tristique sodales, elit ipsum bibendum ipsum, quis feugiat est metus in elit. In vel tristique neque. Vestibulum elementum porttitor metus ac interdum. Aliquam posuere nisi vel velit convallis dignissim. Vivamus ac feugiat turpis. Maecenas vehicula purus quis dapibus posuere. Donec ultrices nibh et velit blandit porttitor. Integer ac porta nunc. Nulla facilisi. Vivamus facilisis mollis lectus, eget facilisis ex elementum eget. Curabitur non scelerisque lectus, ut fermentum eros. Duis ut eros eu orci bibendum convallis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer eget lobortis urna. Morbi nec leo pharetra, tincidunt risus eget, iaculis tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas enim odio, pretium nec libero finibus, suscipit congue sem. Duis aliquam, sem a convallis iaculis, ipsum orci aliquet ex, eget euismod purus mauris id lectus. Vestibulum hendrerit nisl ac nunc accumsan varius. Donec pulvinar felis et nibh malesuada, in imperdiet mauris tincidunt. Morbi dignissim posuere ante, et viverra metus tempor ullamcorper. Cras elementum hendrerit nibh. Praesent congue facilisis ipsum, sit amet pellentesque nisl facilisis eu. Fusce vitae leo consequat, tincidunt risus eget, sagittis turpis. Donec sit amet lacinia leo. Maecenas cursus consequat mi. Aliquam metus leo, iaculis et sem ac, porttitor accumsan dui. Nam placerat enim ac arcu auctor, at egestas tortor auctor. Mauris elementum lectus vel felis faucibus convallis a id magna. Nunc massa purus, tristique quis nisl id, ornare commodo arcu. Nulla eu tincidunt nulla. Curabitur vulputate ex ipsum, condimentum mollis mi dictum at. Morbi vel nisi a ante hendrerit bibendum quis in erat. Nam ut risus ornare, molestie mi quis, lobortis ante. Sed accumsan sollicitudin elit, at commodo nibh tempus vel. Mauris ipsum metus, pharetra rhoncus pulvinar ac, porttitor ut quam. Sed dapibus laoreet metus vitae convallis. Curabitur hendrerit, lorem non faucibus pretium, purus felis sagittis felis, eget sollicitudin libero est quis nunc. Integer interdum interdum lobortis. Nulla bibendum nisi dolor, eget maximus dui pretium vitae."
  }

  openBottomSheet(dash8: string, planner: string): void {
    this._bottomSheet.open(EcoQueueAlertBottomSheetComponent, {
      data: {dash8: dash8, planner: planner}
    });
  }
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    // $('.popover-dismiss').popover({ trigger: 'focus' });
    $('[data-toggle="popover"]').popover();
    // $('.toast').toast();
  }
  
  popMeSummary(event, fleet, rescode, atacode, prime_mpn, keydesc, cataprice, shelflife, chemind, ui, mt, ctlglt) {
    let summary: string = "";
    
    summary = "<div><b>FLEET: </b>" + fleet + "</div>";
    summary += "<div><b>RES CODE:</b> " + rescode + "</div>";
    summary += "<div><b>MT:</b> " + mt + "</div>";
    summary += "<div><b>UI:</b> " + ui + "</div>";
    summary += "<div><b>ATA CODE:</b> " + atacode + "</div>";
    summary += "<div><b>PRIME:</b> " + prime_mpn + "</div>";
    // summary += "<div class='nowrap'><b>KEY DESC:</b> " + keydesc + "</div>";
    summary += "<div><b>CTLG PRICE:</b> $" + cataprice + "</div>";
    summary += "<div><b>CTLG LT:</b> " + ctlglt + "</div>";
    summary += "<div><b>SHELF LIFE:</b> " + shelflife + "</div>";
    summary += "<div><b>CHEMICAL IND:</b> " + chemind + "</div>";
    
    event.currentTarget.dataset.content = summary;
  }

  eoInfoHeaderStyle(): object {
    if (this.searchType == 'NEW_EO_PARTS_TTL_REQ')
      return { 'overflow-y': 'auto', 'width': '100%' };
    else
      return {'height': '550px','overflow-y': 'auto', 'width': '100%'};
   }

  search(term: string): void {
    // this.openPPAMMaintSnackBar();
    this.isLoadingComplete = false;
    this.route.url.subscribe((params: Params) => {
      if (params.length > 2 && params[1].path && params[2].path != term) {
        //window.location.href = 'eo/' + params[1].path + '/' + term;
        switch (this.searchType) {
          case "NEW_EO_LIST.DASH_8": //dash_8
            window.location.href = 'eo/dash8/' + term;
            break;
          case "NEW_EO_PARTS_TTL_REQ": // m&e
            window.location.href = 'eo/menumber/' + term;
            break;
          case "NEW_EO_LIST.EO_NUMBER": //eonumber
            window.location.href = 'eo/eonumber/' + term;
            break;
          default:
            if (term != null)
              if (term.length > 0) {
                this.lastSearched = term;
                const adind = document.getElementById('rdoAD_IND') as HTMLFormElement;
                let newSearch = new EcoInfoReq;
                newSearch.searchTerm = term;
                newSearch.searchType = this.searchType;
                newSearch.ad_ind = adind.checked;
                if (term.length > 1) {
                  //this.searchTerms.next(newSearch);
                  this.hideLoading = false;
                  // this.ecoInfo$ = this.ecoService.searchNewEOList(newSearch);
                  this.ecoService.searchNewEOList(newSearch)
                    .subscribe(x => {
                        this.hideLoading = true,
                        this.ecoInfo$ = x
                      if (this.searchType == 'NEW_EO_LIST.DASH_8' || this.searchType == 'NEW_EO_LIST.EO_NUMBER') {
                        this.ecoService.getEOSummary(term, this.searchType)
                          .subscribe(x => {
                            this.hideLoading = true,
                              this.eoSummary$ = x
                          });
                      }
                    });
                  this.refreshtime$ = this.ecoService.getRefreshTimeEoSearch();
                  if (this.searchType == 'NEW_EO_PARTS_TTL_REQ')
                    this.meDetail$ = this.ecoService.getEoMeDetail(term);
                  if (this.searchType == 'NEW_EO_PARTS_TTL_REQ-MPN')
                    this.meDetail$ = this.ecoService.getEoMeDetailMPN(term);
                }
              }
              else {
                // this.showSearch = false;
                // this.searchDisabled = true;
                this.ecoInfo$ = null;
                this.eoSummary$ = null;
                this.meDetail$ = null;
              }
            else {
              // this.showSearch = false;
              // this.searchDisabled = true;
            }
            this.hidDescList = true;
            break;          
        }
      }
      else {
        if (term != null)
        if (term.length > 0) {
          this.lastSearched = term;
          const adind = document.getElementById('rdoAD_IND') as HTMLFormElement;
          let newSearch = new EcoInfoReq;
          newSearch.searchTerm = term;
          newSearch.searchType = this.searchType;
          newSearch.ad_ind = adind.checked;
          if (term.length > 1) {
            //this.searchTerms.next(newSearch);
            this.hideLoading = false;
            // this.ecoInfo$ = this.ecoService.searchNewEOList(newSearch);     
            this.ecoService.searchNewEOList(newSearch)
              .subscribe(x => {
                  this.hideLoading = true,
                  this.ecoInfo$ = x
                  if (this.searchType == 'NEW_EO_LIST.DASH_8' || this.searchType == 'NEW_EO_LIST.EO_NUMBER') {
                    this.ecoService.getEOSummary(term, this.searchType)
                      .subscribe(x => {
                        this.hideLoading = true,
                          this.eoSummary$ = x
                      });
                  }  
              }); 
            this.refreshtime$ = this.ecoService.getRefreshTimeEoSearch();
            if (this.searchType == 'NEW_EO_PARTS_TTL_REQ')
              this.meDetail$ = this.ecoService.getEoMeDetail(term);
            if (this.searchType == 'NEW_EO_PARTS_TTL_REQ-MPN')
              this.meDetail$ = this.ecoService.getEoMeDetailMPN(term);
          }
        }
        else {
          // this.showSearch = false;
          // this.searchDisabled = true;
          this.eoSummary$ = null;
          this.ecoInfo$ = null;
          this.meDetail$ = null;
        }
    else { 
      // this.showSearch = false;
      // this.searchDisabled = true;
    }
    this.hidDescList = true;
      }
      this.isLoadingComplete = true;
    });

    // if (this.searchEoType.root.children.primary.segments.length > 1 && this.searchEoType.root.children.primary.segments[1].path == "dash8") {
      
    // }
    
  }

  hideSave() { 
    this.showSaveval = false;
  }

  showSave() { 
    this.showSaveval = true;
  }

  setEoNumber(val: string) {
    this.currentEoNumber = val;
  }

  setDash8Number(val: string) { 
    this.currentDash8Number = val;
  }

  setHistoryModal(comment: string, val: string) { 
    this.eoHistoryComment = comment;
    this.currentEoNumber = val;
  }

  setDash8HistoryModal(comment: string, val: string) { 
    this.eoDash8History = comment;
    this.currentDash8Number = val;
  }

  setAircraftScheduledModal(dash8: string) { 
    this.aircraftSched$ = this.ecoService.getAircraftScheduled(dash8.trim());
  }

  setAircraftScheduledInWorkModal(dash8: string) { 
    this.aircraftSchedInWork$ = this.ecoService.getAircraftScheduledInWork(dash8.trim());
  }


  setAircraftAccomplished(dash8: string) { 
    this.aircraftAccomplished$ = this.ecoService.getAircraftAccomplished(dash8.trim());
  }


  onSubmit(form: NgForm, commentType: string, selNumber: string) {
    this.isLoadingComplete = false;
    switch (commentType) {
      case "eonumber":
        if (form.controls.EoNumberComment === undefined) return null;
        let eonumberCommentReq = new EonumberCommentReq();
        eonumberCommentReq.EO_NUMBER = selNumber.trim();
        eonumberCommentReq.Comments_History = this.plannerName.display_name + " - " + form.controls.EoNumberComment.value;
        //eonumberCommentReq.AD_IND = adind.checked;
        this.ecoService.insertEoNumberComment(eonumberCommentReq)
          .subscribe(result => {
            form.controls.EoNumberComment.setValue("");
            $('#eonumber').modal('hide');
            return this.resp = result;
          });
        break;
        case "eohistory":
          if (form.controls.EoNumberHistComment === undefined) return null;
          let eonumberCommentHistReq = new EonumberCommentReq();
          eonumberCommentHistReq.EO_NUMBER = selNumber.trim();
          eonumberCommentHistReq.Comments_History = this.plannerName.display_name + " - " + form.controls.EoNumberHistComment.value;
          //eonumberCommentReq.AD_IND = adind.checked;
          this.ecoService.insertEoNumberComment(eonumberCommentHistReq)
            .subscribe(result => {
              form.controls.EoNumberHistComment.setValue("");
              $('#eohistory').modal('hide');
              return this.resp = result;
            });
          break;
          case "dash8":
            if (form.controls.Dash8Comment === undefined) return null;
            let dash8CommentReq = new Dash8CommentReq();
            dash8CommentReq.DASH_8 = selNumber.trim();
            dash8CommentReq.Comments_History = this.plannerName.display_name + " - " + form.controls.Dash8Comment.value;
            this.ecoService.insertDash8Comment(dash8CommentReq)
              .subscribe(result => {
                form.controls.Dash8Comment.setValue("");
                $('#dash8history').modal('hide');
                return this.resp = result;
              });
            break;
      }
    this.isLoadingComplete = true;
    let now = new Date().getTime();
    while (new Date().getTime() < now + 3000) { }
    this.search(this.lastSearched);
  }
  
  enableSearch(type: string) {
    this.strShowSearch = "display:block;";
    this.showSearch = true;
    this.searchDisabled = false;
    this.searchType = type;
    //const searchInput = document.getElementById('search-Input') as HTMLFormElement;
    // if (searchInput != null)
    //   searchInput.value = "";
    this.ecoInfo$ = null;
    this.eoSummary$ = null;
    this.meDetail$ = null;
    // console.log("searching.." + type);
  }

  disableSearch() { 
    this.strShowSearch = "display:none;";
    this.showSearch = false;
    this.searchDisabled = true;
  }

  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('eoInfo'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //const xs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
  }
  
  // openPPAMMaintSnackBar() {
  //   // var currentTime = moment.utc();
  //   // var warnStartTime = moment.utc("16:45", "HH:mm");
  //   // var warnEndTime = moment.utc("17:00", "HH:mm");

  //   // var maintStartTime = moment.utc('17:00', 'HH:mm');
  //   // var maintEndTime = moment.utc("18:00", "HH:mm");

  //   var currentTime = moment.utc();
  //   var warnStartTime = moment.utc("17:45", "HH:mm");
  //   var warnEndTime = moment.utc("18:00", "HH:mm");

  //   var maintStartTime = moment.utc('18:00', 'HH:mm');
  //   var maintEndTime = moment.utc("18:20", "HH:mm");

  //   var warnIsBetween = currentTime.isBetween(warnStartTime, warnEndTime);
  //   var maintTimeIsBetween = currentTime.isBetween(maintStartTime, maintEndTime);
    
  //   if(warnIsBetween)
  //   this.snackBar.open('IM3 maintenance will begin at 12pm CST.', 'Close', {
  //     duration: 3000
  //   });

  //   if(maintTimeIsBetween)
  //   this.snackBar.open('IM3 is currently updating from 12pm to 12:20pm CST.', 'Close', {
  //     //duration: 3000
  //   });
  // }

  ngOnDestroy() {
    
  }

}
