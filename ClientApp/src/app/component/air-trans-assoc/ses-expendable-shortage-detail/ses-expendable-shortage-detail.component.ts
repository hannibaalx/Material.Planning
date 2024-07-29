import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PartService } from '../../../service/part.service';
import { ExpShortage } from '../../../models/exp-shortage';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ses-expendable-shortage-detail',
  templateUrl: './ses-expendable-shortage-detail.component.html',
  styleUrls: ['./ses-expendable-shortage-detail.component.css']
})
export class SesExpendableShortageDetailComponent implements OnInit, OnDestroy {
  sesDetail$: Observable<ExpShortage[]>;
  //private subscription: Subscription;
  meurl: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partService: PartService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.sesDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.meurl = "https://tableau.aa.com/views/TESGRAPTH/Dashboard1?ME_PART_NUMBER=" + params.get('id').trim() + "&:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=false&:apiID=host1#navType=0&navSrc=Opt&format=pdf",
          //this.mePartNumber = params.get('id'),    
          this.partService.getSesDetail(params.get('id').trim())
          ) 
        )
    );
    
    //this.subscription= this.sesDetail$.subscribe();
  }

  ngOnDestroy(): void{ 
    //this.subscription?.unsubscribe();
  }

}
