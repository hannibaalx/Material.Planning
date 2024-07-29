import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-eo-home',
  templateUrl: './eo-home.component.html',
  styleUrls: ['./eo-home.component.css']
})
export class EoHomeComponent implements OnInit {
  public url: string = "";
  public meurl: string = "";
  viz: any;
  public tableau: any;
  @ViewChild("vizContainer") containerDiv: ElementRef;

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8;X-Frame-Options:SAMEORIGIN'});
    //this.url = "https://tableau.aa.com/#/views/MTPMetrics_16014776385870/ECOPPAMQueuesPerformance?:iid=1:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=true&:apiID=host1#navType=0&navSrc=Opt";
    //this.url = "https://tableau.aa.com/#/views/MTPMetrics/ECOPPAMQueuesPerformance?:iid=1";
    this.url = "https://tableau.aa.com/#/views/MTPMetrics_16025301070150/ECOPPAMQueuesPerformance?&:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=false&:apiID=host1#navType=0&navSrc=Opt&format=pdf";
    //this.meurl = "https://tableau.aa.com/views/TESGRAPTH/Dashboard1?ME_PART_NUMBER=26-2333-3-0043&:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=false&:apiID=host1#navType=0&navSrc=Opt&format=pdf";
    //this.meurl = "https://tableau.aa.com/views/SupplyChainDepartmentLevelDashboard/Fill_Rate_and_Stores?:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=true&:apiID=host1#navType=0&navSrc=Opt";
    //this.meurl = "https://tableau.aa.com/#/views/MTPMetrics_16025301070150/ECOPPAMQueuesPerformance";
  }

  ngAfterViewInit() { 
    // this.initTableau();
  }

  initTableau() { 
    //const containerDiv = document.getElementById("vizContainer");
    const vizURL = "https://tableau.aa.com/#/views/MTPMetrics_16025301070150/ECOPPAMQueuesPerformance?&:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=false&:apiID=host1#navType=0&navSrc=Opt&format=pdf";
    const options = {
      hideTabs: true,
      onFirstInteractive: () => { 

      }
    }
    this.viz = new this.tableau.Viz(this.containerDiv.nativeElement, vizURL, options);
  }

  log(state: string) {
    console.log(state);  
  }
}
