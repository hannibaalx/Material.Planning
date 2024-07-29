import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { OwnershipDetail } from 'src/app/models/ownership-detail';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { PartService } from 'src/app/service/part.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-ownership-details',
  templateUrl: './ownership-details.component.html',
  styleUrls: ['./ownership-details.component.css']
})

export class OwnershipDetailsComponent implements OnInit {
  public ownershipDetail$: Observable<OwnershipDetail[]>;
  public osd_displayedColumnsSpare: string[] = ['ME_PART_NUMBER', 'SERIAL_NUMBER', 'TRACKING_NUMBER', 'MFG_PART_NUMBER', 'SERVICEABILITY_STATUS', 'INDEX_TYPE_CODE_DESC', 'ALPHA_STATION', 'DSC', 'DS_CREW_NAME', 'ACTIVITY_DATE', 'DATE_REMOVED', 'AIRCRAFT_REMOVED_FROM', 'SHIP_FROM_STATION', 'RO_NUMBER', 'COMPNT_TRACK_LOC_TXT', 'LUS_PRSNEL_ID', 'BUCKET', 'RESP_PARTY', 'RESP_STA', 'SPARE'];
  public datasource: MatTableDataSource<OwnershipDetail>;
  public basedatasource: MatTableDataSource<OwnershipDetail>;
  public filterdatasource: MatTableDataSource<OwnershipDetail>;
  public ownershipId: string;
  public mePartNumber: string;
  public typefilter: string = '';
  currentDate = moment().format('YYYY-DD-MM hh:mm');
  fileName = 'Ownership Details - ' + this.currentDate;
  public panelOpenState: boolean = false;
  public _datasource: OwnershipDetail[];
  yescount: number = 0;
  nocount: number = 0;
  allcount: number = 0;
  filterBySpareType: string;
  tmpdatayes: OwnershipDetail[] = [];
  tmpdatano: OwnershipDetail[] = [];
  tmpdata: OwnershipDetail[] = [];
  hideSpinner: boolean = false;


  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private partService: PartService,
  ) { }

  ngOnInit() {
    this.ownershipDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.ownershipId = params.get('id'),
          this.partService.getOwnershipDetailByMeNum(params.get('id'), this.typefilter)
        )
      )
    );

    this.ownershipDetail$.subscribe(data => {
      if (data.length > 0) {
        this.datasource = new MatTableDataSource(data);
        this.tmpdata = data;
        this.datasource.data.forEach(x => {
          if (x.SPARE == 'Yes') { 
            this.tmpdatayes.push(x);
          }
            
          if (x.SPARE == 'No') { 
            this.tmpdatano.push(x);
          }
          this.allcount += 1;
        })
        this.yescount = this.tmpdatayes.length;
        this.nocount = this.tmpdatano.length;
        this.hideSpinner = true;
        // console.log('Yes ->' + this.yescount + ' No -> ' + this.nocount);
      }        
      else
        this.datasource = null;      
      //this.basedatasource = this.datasource;
    });
  }

  

  filterBySpare(typefilter: string) {
  this.typefilter = typefilter;
  this.filterBySpareType = this.typefilter;
  console.log(this.typefilter);
    switch (this.typefilter) {
      case 'yes':
        this.datasource.data = this.tmpdatayes;
        break;
      case 'no':
        this.datasource.data = this.tmpdatano;
        break;
      default:
        this.datasource.data = this.tmpdata;
        break;
     }
  }  
  
  sortOwnershipDetail(event: Sort) {
    let sorttype: string;
    let orderby: string;

    orderby = event.active;
    sorttype = event.direction;

   this.partService.getOwnershipDetailByMeNum(this.ownershipId, this.typefilter, orderby, sorttype)
    .subscribe(data => { 
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.allcount = data.length;
    });
  }

  ngOnDestroy() { 
    //this.subscription?.unsubscribe();
  }
}

function foreach(arg0: (x: any) => void) {
  throw new Error('Function not implemented.');
}

