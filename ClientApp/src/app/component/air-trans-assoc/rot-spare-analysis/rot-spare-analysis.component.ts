import { Subscription, Observable, timer} from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PartService } from 'src/app/service/part.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SaGeneralInfo } from 'src/app/models/sa-general-info';
import { SaPurchaseOrder } from 'src/app/models/sa-purchase-order';
import { SaRepairOrder } from 'src/app/models/sa-repair-order';
import { SaHistoricalData } from 'src/app/models/sa-historical-data';
import { SaTitleSection } from 'src/app/models/sa-title-section';
import { SaImqNotes } from 'src/app/models/sa-imq-notes';
import { SaOverallInventory } from 'src/app/models/sa-overall-inventory';
import { SaMetrics } from 'src/app/models/sa-metrics';
import { SaOpenDiscrepancies } from 'src/app/models/sa-open-discrepancies';
import { SaRecommondationsNotes } from 'src/app/models/sa-recommondations-notes';
import { SaRecommondationsNotesReq } from 'src/app/models/sa-recommondations-notes-req';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SpareAnalysisCommentHistoryComponent } from '../spare-analysis-comment-history/spare-analysis-comment-history.component';
import {Chart}  from 'node_modules/chart.js';
import * as moment from 'moment';
import { SaChartData } from 'src/app/models/sa-chart-data';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-rot-spare-analysis',
  templateUrl: './rot-spare-analysis.component.html',
  styleUrls: ['./rot-spare-analysis.component.css']
})
export class RotSpareAnalysisComponent implements OnInit, OnDestroy {
  meNumber: any = "";
  plannerName: string;
  resp: any;
  dialogValue: string;
  fromDialog: string;
  private subRoute = new Subscription();
  public generalInfo$: Observable<SaGeneralInfo[]>;
  public purchaseOrder$: Observable<SaPurchaseOrder[]>;
  public repairOrder$: Observable<SaRepairOrder[]>;
  public historicalData$: Observable<SaHistoricalData[]>;
  public titleSection$: Observable<SaTitleSection[]>;
  public imqNotes$: Observable<SaImqNotes[]>;
  public overallInventory$: Observable<SaOverallInventory[]>;
  public metrics$: Observable<SaMetrics[]>;
  public openDiscrepancies$: Observable<SaOpenDiscrepancies[]>;
  public recommendationNotes$: Observable<SaRecommondationsNotes[]>;
  public saChartData$: Observable<SaChartData>;
  public ctx: HTMLCanvasElement;//CanvasRenderingContext2D;// HTMLCanvasElement;
  public canvas: any;
  public showChart: boolean = false;
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  public pageheader: string = "ROTABLE SPARE ANALYSIS | MATERIAL PLANNING";

  @ViewChild('externalPdfViewer', {static: true}) public externalPdfViewer;

  constructor(
    private partService: PartService,
    private route: ActivatedRoute,
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.subRoute = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.getData(params.id);
        }
      });
  }

  getData(meNumber: string) {

    // this.plannerName = this.userService.getUser().displayName;

    // console.log(meNumber); 
    this.meNumber = meNumber;
    this.generalInfo$ = this.partService.getSAGeneralInfo(this.meNumber);
    this.purchaseOrder$ = this.partService.getPurchaseOrder(this.meNumber);
    this.repairOrder$ = this.partService.getRepairOrder(this.meNumber);
    this.historicalData$ = this.partService.getHistoricalData(this.meNumber);
    this.titleSection$ = this.partService.getTitleSection(this.meNumber);
    this.imqNotes$ = this.partService.getImqNotes(this.meNumber);
    this.overallInventory$ = this.partService.getOverallInventory(this.meNumber);
    this.metrics$ = this.partService.getMetrics(this.meNumber);
    this.openDiscrepancies$ = this.partService.getOpenDiscrepancies(this.meNumber);
    this.recommendationNotes$ = this.partService.getRecommendationsNotes(this.meNumber);
    this.partService.getSparesAnalysisChart(this.meNumber)
      .subscribe(result => {
        this.renderChart(result[0]);
        this.showChart = true;
       });
  }

  renderChart(data: SaChartData) {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [moment().subtract(11, "month").format('MMM YY'), moment().subtract(10, "month").format('MMM YY'), moment().subtract(9, "month").format('MMM YY'), moment().subtract(8, "month").format('MMM YY'), moment().subtract(7, "month").format('MMM YY'), moment().subtract(6, "month").format('MMM YY'), moment().subtract(5, "month").format('MMM YY'), moment().subtract(4, "month").format('MMM YY'), moment().subtract(3, "month").format('MMM YY'), moment().subtract(2, "month").format('MMM YY'), moment().subtract(1, "month").format('MMM YY'), moment().subtract(0, "month").format('MMM YY')],
        datasets: [{
            label: 'Historical Demand',
            data: [data.M_12, data.M_11, data.M_10, data.M_9, data.M_8, data.M_7, data.M_6, data.M_5, data.M_4, data.M_3, data.M_2, data.M_1, data.M0],
            order: 1,
            backgroundColor: [
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)'
            ],
            borderColor: [
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)',
                'rgba(5, 74, 145, 1)'
            ],
            borderWidth: 1
        },
          {
            label: 'Average Demand',
            data: [
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12,
              (data.M_12 + data.M_11 + data.M_10 + data.M_9 + data.M_8 + data.M_7 + data.M_6 + data.M_5 + data.M_4 + data.M_3 + data.M_2 + data.M_1 + data.M0) / 12
            ],
            type: 'line',
            // this dataset is drawn on top
            order: 2,
            backgroundColor: [
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)'
            ],
            borderColor: [
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)',
                'rgba(112, 112, 120, 1)'
            ],
            fill: 'Disabled'
          }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  });
}

onSubmit(form: NgForm) {
  let recommendationNoteReq = new SaRecommondationsNotesReq();
  recommendationNoteReq.PLANNER_NAME = this.user.display_name;
  recommendationNoteReq.COMMENTS = form.controls.txtComment.value;
  recommendationNoteReq.ME_PART_NUMBER = this.meNumber;

  if (form.value.txtComment.length)
    this.partService.insertSpareAnalysisComment(recommendationNoteReq)
      .subscribe(result => {
        const pauseCounter = timer(2000);  //todo catch errors and show saving overlay
        pauseCounter.subscribe(n => {
          form.controls.txtComment.reset("");
          this.recommendationNotes$ = null;
          this.getData(this.meNumber);
        });
        return this.resp = result;
      });
}
  
  openSaHistory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '590px';
    dialogConfig.maxWidth = '590px';
    dialogConfig.data = { menumber: this.meNumber }

    let dialogRef = this.dialog.open(
      SpareAnalysisCommentHistoryComponent, dialogConfig  
    );

    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`The dialog was closed.  Dialog result: ${result}`);
      this.dialogValue = result.data;
      this.getData(this.meNumber);
    });
  }

  print_PDF(id: string): void {
    document.title = "ROTABLE SPARE ANALYSIS - " + id + " - " + moment().format('YYYY-MM-DD') + ".pdf";
    window.print();
  }
  
  ngOnDestroy() { 
    this.subRoute.unsubscribe;
  }

}
