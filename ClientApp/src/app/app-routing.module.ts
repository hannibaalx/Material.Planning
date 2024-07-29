import { User } from './models/user';
import { UserRoleService } from './service/userrole.service';
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { AtaComponent } from './component/air-trans-assoc/ata/ata.component';
import { MessagesComponent } from './messages/messages.component';
import { PartSearchComponent } from './component/air-trans-assoc/part-search/part-search.component';
import { DemtypeComponent } from './component/air-trans-assoc/demtype/demtype.component';
import { SesExpendableShortageDetailComponent } from './component/air-trans-assoc/ses-expendable-shortage-detail/ses-expendable-shortage-detail.component';
import { DeferralComponent } from './component/air-trans-assoc/deferral/deferral.component';
import { SparesAnalysisComponent } from './component/air-trans-assoc/spares-analysis/spares-analysis.component';
import { StockDataDetailComponent } from './component/air-trans-assoc/stock-data-detail/stock-data-detail.component';
import { StockDataTotalDetailComponent } from './component/air-trans-assoc/stock-data-total-detail/stock-data-total-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlannerQueueComponent } from './component/planner-queue/planner-queue.component';
import { ZeroStockComponent } from './component/planner-queue/queues/zero-stock/zero-stock.component';
import { BaselineStationShortageComponent } from './component/planner-queue/queues/baseline-station-shortage/baseline-station-shortage.component';
import { SystemLowStockComponent } from './component/planner-queue/alerts/system-low-stock/system-low-stock.component';
import { AgingPoRoComponent } from './component/planner-queue/alerts/aging-po-ro/aging-po-ro.component';
import { AosReviewComponent } from './component/planner-queue/alerts/aos-review/aos-review.component';
import { OpenDiscrepancyComponent } from './component/planner-queue/queues/open-discrepancy/open-discrepancy.component';
import { TesCriticalComponent } from './component/planner-queue/queues/tes-critical/tes-critical.component';
import { PartsShortageForKitComponent } from './component/planner-queue/queues/parts-shortage-for-kit/parts-shortage-for-kit.component';
import { KitShortageByPartsComponent } from './component/planner-queue/queues/kit-shortage-by-parts/kit-shortage-by-parts.component';
import { CatalogExpirationComponent } from './component/planner-queue/alerts/catalog-expiration/catalog-expiration.component';
import { VendorWoAssignmentComponent } from './component/planner-queue/alerts/vendor-wo-assignment/vendor-wo-assignment.component';
import { MainStationBalancingComponent } from './component/planner-queue/alerts/main-station-balancing/main-station-balancing.component';
import { OutStationBalancingComponent } from './component/planner-queue/alerts/out-station-balancing/out-station-balancing.component';
import { RepOhAqReviewComponent } from './component/planner-queue/queues/rep-oh-aq-review/rep-oh-aq-review.component';
import { NegativeOwnershipChangeComponent } from './component/planner-queue/queues/negative-ownership-change/negative-ownership-change.component';
import { SoPendingReviewComponent } from './component/planner-queue/queues/so-pending-review/so-pending-review.component';
import { OwnershipNoAllocationComponent } from './component/planner-queue/alerts/ownership-no-allocation/ownership-no-allocation.component';
import { UsageNoAllocationComponent } from './component/planner-queue/alerts/usage-no-allocation/usage-no-allocation.component';
import { PlQueueAlertComponent } from './component/air-trans-assoc/pl-queue-alert/pl-queue-alert.component';
import { ZeroStockCommentsComponent } from './component/planner-queue/queues/zero-stock-comments/zero-stock-comments.component';
import { BaselineStationShortageCommentsComponent } from './component/planner-queue/queues/baseline-station-shortage-comments/baseline-station-shortage-comments.component';
import { TesCriticalCommentsComponent } from './component/planner-queue/queues/tes-critical-comments/tes-critical-comments.component';
import { PartsShortageForKitCommentsComponent } from './component/planner-queue/queues/parts-shortage-for-kit-comments/parts-shortage-for-kit-comments.component';
import { KitShortageForPartsCommentsComponent } from './component/planner-queue/queues/kit-shortage-for-parts-comments/kit-shortage-for-parts-comments.component';
import { RepOhAqReviewCommentsComponent } from './component/planner-queue/queues/rep-oh-aq-review-comments/rep-oh-aq-review-comments.component';
import { NegativeOwnershipChangeCommentsComponent } from './component/planner-queue/queues/negative-ownership-change-comments/negative-ownership-change-comments.component';
import { SoPendingReviewCommentsComponent } from './component/planner-queue/queues/so-pending-review-comments/so-pending-review-comments.component';
import { SystemLowStockAlertComponent } from './component/planner-queue/alerts/system-low-stock-alert/system-low-stock-alert.component';
import { AgingPoRoAlertComponent } from './component/planner-queue/alerts/aging-po-ro-alert/aging-po-ro-alert.component';
import { AosReviewAlertComponent } from './component/planner-queue/alerts/aos-review-alert/aos-review-alert.component';
import { OpenDiscrepancyAlertComponent } from './component/planner-queue/queues/open-discrepancy-alert/open-discrepancy-alert.component';
import { CatalogExpirationAlertComponent } from './component/planner-queue/alerts/catalog-expiration-alert/catalog-expiration-alert.component';
import { VendorWoAssignmentAlertComponent } from './component/planner-queue/alerts/vendor-wo-assignment-alert/vendor-wo-assignment-alert.component';
import { OwnershipNoAllocationAlertComponent } from './component/planner-queue/alerts/ownership-no-allocation-alert/ownership-no-allocation-alert.component';
import { UsageNoAllocationAlertComponent } from './component/planner-queue/alerts/usage-no-allocation-alert/usage-no-allocation-alert.component';
import { MainStationBalancingAlertComponent } from './component/planner-queue/alerts/main-station-balancing-alert/main-station-balancing-alert.component';
import { OutStationBalancingAlertComponent } from './component/planner-queue/alerts/out-station-balancing-alert/out-station-balancing-alert.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { EcoComponent } from './component/eng-change-order/eco/eco/eco.component';
import { EcoDetailComponent } from './component/eng-change-order/eco/eco-detail/eco-detail.component';
import { EoDash8DetailComponent } from './component/eng-change-order/eco/eo-dash8-detail/eo-dash8-detail.component';
import { MeUsedDetailComponent } from './component/eng-change-order/eco/me-used-detail/me-used-detail.component';
import { EoMeDetailComponent } from './component/eng-change-order/eco/eo-me-detail/eo-me-detail.component';
import { MePoDetailComponent } from './component/eng-change-order/eco/me-po-detail/me-po-detail.component';
import { MePoStaDetailComponent } from './component/eng-change-order/eco/me-po-sta-detail/me-po-sta-detail.component';
import { MeKitPoDetailComponent } from './component/eng-change-order/eco/me-kit-po-detail/me-kit-po-detail.component';
import { MelComponent } from './component/planner-queue/queues/mel/mel.component';
import { MelCommentsComponent } from './component/planner-queue/queues/mel-comments/mel-comments.component';
import { NefComponent } from './component/planner-queue/alerts/nef/nef.component';
import { NefAlertComponent } from './component/planner-queue/alerts/nef-alert/nef-alert.component';
import { EoPlannerQueueComponent } from './component/eng-change-order/eo-planner-queue/eo-planner-queue.component';
import { PartShortage30Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage30/part-shortage30.component';
import { PartShortage60Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage60/part-shortage60.component';
import { EoNoDash8Component } from './component/eng-change-order/eo-planner-queue/queue/eo-no-dash8/eo-no-dash8.component';
import { PartsDiscrepancyComponent } from './component/eng-change-order/eo-planner-queue/alerts/parts-discrepancy/parts-discrepancy.component';
import { OverduePoRoComponent } from './component/eng-change-order/eo-planner-queue/alerts/overdue-po-ro/overdue-po-ro.component';
import { PartShortage6090Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage6090/part-shortage6090.component';
import { PartShortage90Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage90/part-shortage90.component';
import { PartShortage120Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage120/part-shortage120.component';
import { PartShortage180Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage180/part-shortage180.component';
import { PartShortage120180Component } from './component/eng-change-order/eo-planner-queue/queue/part-shortage120180/part-shortage120180.component';
import { PartShortage180PlusComponent } from './component/eng-change-order/eo-planner-queue/queue/part-shortage180-plus/part-shortage180-plus.component';
import { OverdueEoKitWorkOrderComponent } from './component/eng-change-order/eo-planner-queue/alerts/overdue-eo-kit-work-order/overdue-eo-kit-work-order.component';
import { PartShortageComponent } from './component/eng-change-order/eo-planner-queue/reports/part-shortage/part-shortage.component';
import { RepairOrderComponent } from './component/eng-change-order/eo-planner-queue/reports/repair-order/repair-order.component';
import { FullScheduleComponent } from './component/eng-change-order/eo-planner-queue/reports/full-schedule/full-schedule.component';
import { PurchaseOrderComponent } from './component/eng-change-order/eo-planner-queue/reports/purchase-order/purchase-order.component';
import { EoReportComponent } from './component/eng-change-order/eo-planner-queue/reports/eo-report/eo-report.component';
import { AdPartsShortageComponent } from './component/eng-change-order/eo-planner-queue/queue/ad-parts-shortage/ad-parts-shortage.component';
import { NewStationsChangesComponent } from './component/eng-change-order/eo-planner-queue/queue/new-stations-changes/new-stations-changes.component';
import { EoHomeComponent } from './component/eng-change-order/eo-home/eo-home.component';
import { MeRoStaDetailComponent } from './component/eng-change-order/eco/me-ro-sta-detail/me-ro-sta-detail.component';
import { MeSoStaDetailComponent } from './component/eng-change-order/eco/me-so-sta-detail/me-so-sta-detail.component';
import { MeRoDetailComponent } from './component/eng-change-order/eco/me-ro-detail/me-ro-detail.component';
import { Area51Component } from './component/area51/area51.component';
import { EoManageNoDash8Component } from './component/eng-change-order/eco/eo-manage-no-dash8/eo-manage-no-dash8.component';
import { NewDash8WithNoBomComponent } from './component/eng-change-order/eo-planner-queue/queue/new-dash8-with-no-bom/new-dash8-with-no-bom.component';
import { SaveSnackbarComponent } from './component/util/save-snackbar/save-snackbar.component';
import { SupervisorViewComponent } from './component/eng-change-order/supervisor-view/supervisor-view.component';
import { AtaPqStickyFooterComponent } from './component/util/ata-pq-sticky-footer/ata-pq-sticky-footer.component';
import { AtaStickyFooterComponent } from './component/util/ata-sticky-footer/ata-sticky-footer.component';
import { CommentHistoryComponent } from './component/planner-queue/comment-history/comment-history.component';
import { BomInventoryComponent } from './component/eng-change-order/eo-planner-queue/reports/bom-inventory/bom-inventory.component';
import { YesterdayDeferralsComponent } from './component/eng-change-order/eo-planner-queue/alerts/yesterday-deferrals/yesterday-deferrals.component';
import { MeEcoHistoryComponent } from './component/air-trans-assoc/me-eco-history/me-eco-history.component';
import { MeEcoInsertHistoryComponent } from './component/air-trans-assoc/me-eco-insert-history/me-eco-insert-history.component';
import { CapableStationShortageComponent } from './component/eng-change-order/eo-planner-queue/queue/capable-station-shortage/capable-station-shortage.component';
import { EoStationShortageComponent } from './component/eng-change-order/eo-planner-queue/queue/eo-station-shortage/eo-station-shortage.component';
import { RepSpareAnalysisComponent } from './component/air-trans-assoc/rep-spare-analysis/rep-spare-analysis.component';
import { RotSpareAnalysisComponent } from './component/air-trans-assoc/rot-spare-analysis/rot-spare-analysis.component';
import { SpareAnalysisCommentHistoryComponent } from './component/air-trans-assoc/spare-analysis-comment-history/spare-analysis-comment-history.component';
import { OwnershipDetailsComponent } from './component/air-trans-assoc/ownership-details/ownership-details.component';
import { ItsDataComponent } from './component/air-trans-assoc/its-data/its-data.component';
import { ItsTotalDataComponent } from './component/air-trans-assoc/its-total-data/its-total-data.component';
import { PoDiscrepancyComponent } from './component/eng-change-order/eo-planner-queue/reports/po-discrepancy/po-discrepancy.component';
import { MeKitRoDetailComponent } from './component/eng-change-order/eco/me-kit-ro-detail/me-kit-ro-detail.component';
import { EcoStationReadinessComponent } from './component/eng-change-order/eo-planner-queue/reports/eco-station-readiness/eco-station-readiness.component';
import { EcoQueueAlertBottomSheetComponent } from './component/eng-change-order/eco/eco/eco-queue-alert-bottom-sheet/eco-queue-alert-bottom-sheet.component';
import { EoBomKitDetailsComponent } from './component/eng-change-order/eo-planner-queue/eo-bom-kit-details/eo-bom-kit-details.component';
import { EoManageAlternativePartDash8Component } from './component/eng-change-order/eco/eo-manage-alternative-part-dash8/eo-manage-alternative-part-dash8.component';
import { ScheduledMaintenanceComponent } from './component/scheduled-maintenance/scheduled-maintenance.component';
import { SmSearchComponent } from './component/scheduled-maintenance/sm-search/sm-search.component';
import { SmReportsComponent } from './component/scheduled-maintenance/sm-reports/sm-reports.component';
import { SmPlannerQueueAlertComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-planner-queue-alert.component';
import { SmManagenodash8Component } from './component/scheduled-maintenance/sm-managenodash8/sm-managenodash8.component';
import { SmCommentHistoryComponent } from './component/scheduled-maintenance/sm-comment-history/sm-comment-history.component';
import { SmMinScheduledDateComponent } from './component/scheduled-maintenance/sm-min-scheduled-date/sm-min-scheduled-date.component';
import { SmDash8DetailComponent } from './component/scheduled-maintenance/sm-dash8-detail/sm-dash8-detail.component';
import { SmPoDetailComponent } from './component/scheduled-maintenance/sm-po-detail/sm-po-detail.component';
import { SmRoDetailComponent } from './component/scheduled-maintenance/sm-ro-detail/sm-ro-detail.component';
import { SmPoStaDetailComponent } from './component/scheduled-maintenance/sm-po-sta-detail/sm-po-sta-detail.component';
import { SmRoStaDetailComponent } from './component/scheduled-maintenance/sm-ro-sta-detail/sm-ro-sta-detail.component';
import { SmSoStaDetailComponent } from './component/scheduled-maintenance/sm-so-sta-detail/sm-so-sta-detail.component';
import { SmKitPoStaDetailComponent } from './component/scheduled-maintenance/sm-kit-po-sta-detail/sm-kit-po-sta-detail.component';
import { SmKitRoStaDetailComponent } from './component/scheduled-maintenance/sm-kit-ro-sta-detail/sm-kit-ro-sta-detail.component';
import { SmBaselineStationShortageComponent } from './component/planner-queue/queues/sm-baseline-station-shortage/sm-baseline-station-shortage.component';
import { SmBaselineStationShortageCommentsComponent } from './component/planner-queue/queues/sm-baseline-station-shortage-comments/sm-baseline-station-shortage-comments.component';
import { SmTsxWcNumComponent } from './component/scheduled-maintenance/sm-tsx-wc-num/sm-tsx-wc-num.component';
import { SmMeDetailComponent } from './component/scheduled-maintenance/sm-me-detail/sm-me-detail.component';
import { SmPartNoLongerUsedComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-part-no-longer-used/sm-part-no-longer-used.component';
import { SmNewStationsChangesComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-new-stations-changes/sm-new-stations-changes.component';
import { SmTsxCompareComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-tsx-compare/sm-tsx-compare.component';
import { SmDeferralReviewComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-deferral-review/sm-deferral-review.component';
import { SmScheduledRotableBomComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-scheduled-rotable-bom/sm-scheduled-rotable-bom.component';
import { SmPartLongerUsedCommentsComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-part-longer-used-comments/sm-part-longer-used-comments.component';
import { SmPlannerCommentHistoryComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-planner-comment-history/sm-planner-comment-history.component';
import { SmDash8CommentDetailsComponent } from './component/planner-queue/queues/sm-dash8-comment-details/sm-dash8-comment-details.component';
import { SmNewStationsChangesCommentsComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-new-stations-changes-comments/sm-new-stations-changes-comments.component';
import { SmStationAddedShortageDetailComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-station-added-shortage-detail/sm-station-added-shortage-detail.component';
import { SmNextDueDateDetailComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-next-due-date-detail/sm-next-due-date-detail.component';
import { SmScheduledRotableBomCommentsComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-scheduled-rotable-bom-comments/sm-scheduled-rotable-bom-comments.component';
import { MeImqHpfDetailComponent } from './component/air-trans-assoc/me-imq-hpf-detail/me-imq-hpf-detail.component';
import { MeSummaryMePartNumberDetailsComponent } from './component/air-trans-assoc/me-summary-me-part-number-details/me-summary-me-part-number-details.component';
import { MeSplitMeDetailComponent } from './component/air-trans-assoc/me-split-me-detail/me-split-me-detail.component';
import { SmDeferralReviewCommentsComponent } from './component/scheduled-maintenance/sm-planner-queue-alert/sm-deferral-review-comments/sm-deferral-review-comments.component';
import { ReportComponent } from './component/report/report/report.component';
import { NavigationComponent } from './component/report/navigation/navigation.component';
import { GeneralComponent } from './component/report/general/general.component';
import { EoreportsComponent } from './component/report/eoreports/eoreports.component';
import { AtareportsComponent } from './component/report/atareports/atareports.component';
import { SmreportsComponent } from './component/report/smreports/smreports.component';
import { EoPartShortageComponent } from './component/report/eoreports/eo-part-shortage/eo-part-shortage.component';
import { EoRepairOrderComponent } from './component/report/general/eo-repair-order/eo-repair-order.component';
import { EoFullScheduleComponent } from './component/report/eoreports/eo-full-schedule/eo-full-schedule.component';
import { EoPurchaseOrderComponent } from './component/report/general/eo-purchase-order/eo-purchase-order.component';
import { EoBomInventoryComponent } from './component/report/eoreports/eo-bom-inventory/eo-bom-inventory.component';
import { EoEcoStationReadinessComponent } from './component/report/eoreports/eo-eco-station-readiness/eo-eco-station-readiness.component';
import { EoPoDiscrepancyComponent } from './component/report/eoreports/eo-po-discrepancy/eo-po-discrepancy.component';
import { EopurchaseorderComponent } from './component/report/eoreports/eopurchaseorder/eopurchaseorder.component';
import { EorepairorderComponent } from './component/report/eoreports/eorepairorder/eorepairorder.component';
import { EoCancelledPoComponent } from './component/report/general/eo-cancelled-po/eo-cancelled-po.component';
import { SchedRotRepShortageComponent } from './component/planner-queue/queues/sched-rot-rep-shortage/sched-rot-rep-shortage.component';
import { SchedRotRepShortageCommentsComponent } from './component/planner-queue/queues/sched-rot-rep-shortage-comments/sched-rot-rep-shortage-comments.component';
import { BerReportComponent } from './component/report/atareports/ber-report/ber-report.component';
import { JifReportComponent } from './component/report/atareports/jif-report/jif-report.component';
import { AtaNavComponent } from './component/air-trans-assoc/ata-nav/ata-nav.component';
import { AssociatedMeNoStockComponent } from './component/planner-queue/queues/associated-me-no-stock/associated-me-no-stock.component';
import { AssociatedMeNoStockCommentComponent } from './component/planner-queue/queues/associated-me-no-stock-comment/associated-me-no-stock-comment.component';
import { AtaPartsSummaryComponent } from './component/air-trans-assoc/ata-parts-summary/ata-parts-summary.component';
import { ReplenishmentMatrixComponent } from './nav-menu/replenishment-matrix/replenishment-matrix.component';
import { NewMeSetupOrChangesComponent } from './component/planner-queue/queues/new-me-setup-or-changes/new-me-setup-or-changes.component';
import { NewMeSetupOrChangesCommentsComponent } from './component/planner-queue/queues/new-me-setup-or-changes-comments/new-me-setup-or-changes-comments.component';
import { ScrapsComponent } from './component/planner-queue/queues/scraps/scraps.component';
import { ScrapsCommentsComponent } from './component/planner-queue/queues/scraps-comments/scraps-comments.component';
import { DateFormatsComponent } from './component/planner-queue/date-formats/date-formats.component';
import { OnHoldEosComponent } from './component/eng-change-order/eo-planner-queue/alerts/on-hold-eos/on-hold-eos.component';
import { LoginComponent } from './home/login/login.component';
import { MaintSnackbarComponent } from './component/util/maint-snackbar/maint-snackbar.component';
import { Im3NavMenuComponent } from './im3-nav-menu/im3-nav-menu.component';
import { IoToolComponent } from './io-tool/io-tool.component';
//import { MatAccordion } from '@angular/material/expansion';
import { PingAuthGuard } from '@techops-ui/ping-authentication';
import { AppComponent } from './app.component';
import { UserRoleComponent } from './component/user-role/user-role.component';
import { RoleGuard } from './role.guard';
import { ROLES } from './models/roles';
import { MereviewComponent } from './component/air-trans-assoc/mereview/mereview.component';

const appRoutes: Routes = [
  { path: 'ata/replenishment-matrix', component: ReplenishmentMatrixComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/itstotaldetail/:id', component: ItsTotalDataComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/itsdetail/:id/:station', component: ItsDataComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/ownershipdetail/:id', component: OwnershipDetailsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/repspareanalysis/:id', component: RepSpareAnalysisComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/rotspareanalysis/:id', component: RotSpareAnalysisComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/stockdatatotaldetail/:id/:otype', component: StockDataTotalDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/stockdatatotaldetail/:id/:otype/:reqpostatus', component: StockDataTotalDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/stockdatadetail/:id/:station/:otype/:reqpostatus', component: StockDataDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/stockdatadetail/:id/:station/:otype', component: StockDataDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/ses/detail/:id', component: SesExpendableShortageDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/zscomment/:id', component: ZeroStockCommentsComponent, canActivate: [PingAuthGuard] },
  // { path: 'ata/bsscomment/:id', component: BaselineStationShortageCommentsComponent },
  { path: 'ata/bsscomment/:id', component: SmBaselineStationShortageCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/schedrrcomment/:id', component: SchedRotRepShortageCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/tescomment/:id', component: TesCriticalCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/pskcomment/:id', component: PartsShortageForKitCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/kspcomment/:id', component: KitShortageForPartsCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/repohaqcomment/:id', component: RepOhAqReviewCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/negcomment/:id', component: NegativeOwnershipChangeCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/sopendcomment/:id', component: SoPendingReviewCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/slsalert/:id', component: SystemLowStockAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/overdalert/:id', component: AgingPoRoAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/opdiscalert/:id', component: OpenDiscrepancyAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/aosalert/:id', component: AosReviewAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/catexpalert/:id', component: CatalogExpirationAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/amns/:id', component: AssociatedMeNoStockCommentComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/vwaalert/:id', component: VendorWoAssignmentAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/obnaalert/:id', component: OwnershipNoAllocationAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/unaalert/:id', component: UsageNoAllocationAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/unaalert/:id/:sta', component: UsageNoAllocationAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/msbalert/:id', component: MainStationBalancingAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/outstaalert/:id', component: OutStationBalancingAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/nmsc/:id', component: NewMeSetupOrChangesCommentsComponent, canActivate: [PingAuthGuard] },
  { path: 'ata/scraps/:id', component: ScrapsCommentsComponent, canActivate: [PingAuthGuard] },
    // { path: 'ata/:id', component: AtaComponent },
  // { path: 'ata', component: AtaComponent },
  { path: 'ata/:id', component: AtaPartsSummaryComponent, canActivate: [PingAuthGuard] },
  { path: 'ata', component: AtaPartsSummaryComponent, canActivate: [PingAuthGuard] },
  // { path: 'ata2', component: AtaPartsSummaryComponent },
  // { path: 'ata2/:id', component: AtaPartsSummaryComponent },
  //{ path: 'eo/plq', component: EoPlannerQueueComponent, canActivate: [RoleGuard, PingAuthGuard], data: { requiredRole: [ROLES.ADMIN, ROLES.User, ROLES.SUPERVISOR] } },
  { path: 'eo/plq', component: EoPlannerQueueComponent, canActivate: [PingAuthGuard]},
  { path: 'eo/plq/eobomkitdetail/:dash8/:type/:planner', component: EoBomKitDetailsComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/reports', component: EoReportComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/meuseddetail/:id', component: MeUsedDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/mekitpodetail/:dash8/:id', component: MeKitPoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/mekitrodetail/:id', component: MeKitRoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/mepostadetail/:dash8/:id/:station', component: MePoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/merostadetail/:dash8/:id/:station', component: MeRoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/mesostadetail/:dash8/:id/:station', component: MeSoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/mepodetail/:id', component: MePoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/merodetail/:dash8/:id', component: MeRoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/medetail/:menumberid/:id', component: EoMeDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/dash8/:id', component: EcoComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/dash8detail/:id', component: EoDash8DetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/managenodash8', component: EoManageNoDash8Component, canActivate: [PingAuthGuard] },
  { path: 'eo/managealternativepartdash8', component: EoManageAlternativePartDash8Component },
  { path: 'eo/eonumber/:id', component: EcoComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/menumber/:id', component: EcoComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/detail', component: EcoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/search', component: EcoComponent, canActivate: [PingAuthGuard] },
  { path: 'eo/supervisorview', component: SupervisorViewComponent, canActivate: [PingAuthGuard] },
  { path: 'report', component: ReportComponent, canActivate: [PingAuthGuard] },
  { path: 'report/ata', component: AtareportsComponent, canActivate: [PingAuthGuard] },
  { path: 'report/ata/jif-report', component: JifReportComponent, canActivate: [PingAuthGuard] },
  { path: 'report/ata/ber-report', component: BerReportComponent, canActivate: [PingAuthGuard] },
  { path: 'report/eo', component: EoreportsComponent, canActivate: [PingAuthGuard] },
  { path: 'report/general', component: GeneralComponent, canActivate: [PingAuthGuard] },
  { path: 'report/sm', component: SmreportsComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/dash8detail/:id', component: SmDash8DetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/podetail/:id', component: SmPoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/medetail/:id', component: SmMeDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/mekitpodetail/:dash8/:id', component: SmKitPoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/mekitrodetail/:dash8/:id', component: SmKitRoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/mekitrodetail/:id', component: SmKitRoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/mepostadetail/:dash8/:id/:station', component: SmPoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/merostadetail/:dash8/:id/:station', component: SmRoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/mesostadetail/:dash8/:id/:station', component: SmSoStaDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/tsxwcnum/:id', component: SmTsxWcNumComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/rodetail/:id', component: SmRoDetailComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/sm-search', component: SmSearchComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/sm-search/ata/:mepartnumber', component: SmSearchComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/sm-search/dash8/:dash8', component: SmSearchComponent, canActivate: [PingAuthGuard] },
  //{ path: 'sm/sm-plq', component: SmPlannerQueueAlertComponent, canActivate: [RoleGuard, PingAuthGuard], data: { requiredRole: [ROLES.ADMIN, ROLES.User, ROLES.SUPERVISOR] } },
  { path: 'sm/sm-plq', component: SmPlannerQueueAlertComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/sm-reports', component: SmReportsComponent, canActivate: [PingAuthGuard] },
  { path: 'sm/sm-managenodash8', component: SmManagenodash8Component, canActivate: [PingAuthGuard] },
  { path: 'iotool', component: IoToolComponent, canActivate: [PingAuthGuard] },
  //{ path: 'userrole', component: UserRoleComponent, canActivate: [RoleGuard, PingAuthGuard], data: { requiredRole: [ROLES.ADMIN] } },
  { path: 'userrole', component: UserRoleComponent, canActivate: [PingAuthGuard] },
  { path: 'eo', component: EoHomeComponent, canActivate: [PingAuthGuard] },
  //{ path: 'plq', component: PlannerQueueComponent, canActivate: [RoleGuard, PingAuthGuard], data: { requiredRole: [ROLES.ADMIN, ROLES.User, ROLES.SUPERVISOR] } },
  { path: 'plq', component: PlannerQueueComponent, canActivate: [PingAuthGuard] },
  { path: 'area51', component: Area51Component },
  { path: 'mp', component: HomeComponent, pathMatch: 'full' },
  { path: '',   redirectTo: '/ata', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    HomeComponent,
    AtaComponent,
    MessagesComponent,
    PartSearchComponent,
    DemtypeComponent,
    SesExpendableShortageDetailComponent,
    DeferralComponent,
    SparesAnalysisComponent,
    StockDataDetailComponent,
    StockDataTotalDetailComponent,
    PageNotFoundComponent,
    PlannerQueueComponent,
    ZeroStockComponent,
    BaselineStationShortageComponent,
    SystemLowStockComponent,
    AgingPoRoComponent,
    AosReviewComponent,
    OpenDiscrepancyComponent,
    TesCriticalComponent,
    PartsShortageForKitComponent,
    KitShortageByPartsComponent,
    CatalogExpirationComponent,
    VendorWoAssignmentComponent,
    MainStationBalancingComponent,
    OutStationBalancingComponent,
    RepOhAqReviewComponent,
    NegativeOwnershipChangeComponent,
    SoPendingReviewComponent,
    OwnershipNoAllocationComponent,
    UsageNoAllocationComponent,
    PlQueueAlertComponent,
    ZeroStockCommentsComponent,
    BaselineStationShortageCommentsComponent,
    TesCriticalCommentsComponent,
    PartsShortageForKitCommentsComponent,
    KitShortageForPartsCommentsComponent,
    RepOhAqReviewCommentsComponent,
    NegativeOwnershipChangeCommentsComponent,
    SoPendingReviewCommentsComponent,
    SystemLowStockAlertComponent,
    AgingPoRoAlertComponent,
    AosReviewAlertComponent,
    OpenDiscrepancyAlertComponent,
    CatalogExpirationAlertComponent,
    VendorWoAssignmentAlertComponent,
    OwnershipNoAllocationAlertComponent,
    UsageNoAllocationAlertComponent,
    MainStationBalancingAlertComponent,
    OutStationBalancingAlertComponent,
    NotAuthorizedComponent,
    EcoComponent,
    EcoDetailComponent,
    EoDash8DetailComponent,
    MeUsedDetailComponent,
    EoMeDetailComponent,
    MePoDetailComponent,
    MePoStaDetailComponent,
    MeKitPoDetailComponent,
    MeKitRoDetailComponent,
    MelComponent,
    MelCommentsComponent,
    NefComponent,
    NefAlertComponent,
    EoPlannerQueueComponent,
    PartShortage30Component,
    PartShortage60Component,
    EoNoDash8Component,
    PartsDiscrepancyComponent,
    OverduePoRoComponent,
    PartShortage90Component,
    PartShortage120Component,
    PartShortage180Component,
    PartShortage180PlusComponent,
    OverdueEoKitWorkOrderComponent,
    PartShortageComponent,
    RepairOrderComponent,
    FullScheduleComponent,
    PurchaseOrderComponent,
    EoReportComponent,
    AdPartsShortageComponent,
    NewStationsChangesComponent,
    EoHomeComponent,
    MeRoStaDetailComponent,
    MeSoStaDetailComponent,
    MeRoDetailComponent,
    Area51Component,
    EoManageNoDash8Component,
    NewDash8WithNoBomComponent,
    SaveSnackbarComponent,
    SupervisorViewComponent,
    AtaPqStickyFooterComponent,
    AtaStickyFooterComponent,
    CommentHistoryComponent,
    BomInventoryComponent,
    YesterdayDeferralsComponent,
    MeEcoHistoryComponent,
    MeEcoInsertHistoryComponent,
    PartShortage6090Component,
    PartShortage120180Component,
    CapableStationShortageComponent,
    EoStationShortageComponent,
    RepSpareAnalysisComponent,
    RotSpareAnalysisComponent,
    SpareAnalysisCommentHistoryComponent,
    OwnershipDetailsComponent,
    ItsDataComponent,
    ItsTotalDataComponent,
    PoDiscrepancyComponent,
    EcoStationReadinessComponent,
    EcoQueueAlertBottomSheetComponent,
    EoBomKitDetailsComponent,
    EoManageAlternativePartDash8Component,
    ScheduledMaintenanceComponent,
    SmSearchComponent,
    SmPlannerQueueAlertComponent,
    SmReportsComponent,
    SmManagenodash8Component,
    SmCommentHistoryComponent,
    SmMinScheduledDateComponent,
    SmDash8DetailComponent,
    SmPoDetailComponent,
    SmRoDetailComponent,
    SmPoStaDetailComponent,
    SmRoStaDetailComponent,
    SmKitPoStaDetailComponent,
    SmKitRoStaDetailComponent,
    SmSoStaDetailComponent,
    SmBaselineStationShortageComponent,
    SmBaselineStationShortageCommentsComponent,
    SmTsxWcNumComponent,
    SmMeDetailComponent,
    SmPartNoLongerUsedComponent,
    SmNewStationsChangesComponent,
    SmTsxCompareComponent,
    SmDeferralReviewComponent,
    SmScheduledRotableBomComponent,
    SmPartLongerUsedCommentsComponent,
    SmPlannerCommentHistoryComponent,
    SmDash8CommentDetailsComponent,
    SmNewStationsChangesCommentsComponent,
    SmStationAddedShortageDetailComponent,
    SmNextDueDateDetailComponent,
    SmScheduledRotableBomCommentsComponent,
    MeImqHpfDetailComponent,
    MeSummaryMePartNumberDetailsComponent,
    MeSplitMeDetailComponent,
    SmDeferralReviewCommentsComponent,
    ReportComponent,
    NavigationComponent,
    GeneralComponent,
    AtareportsComponent,
    EoreportsComponent,
    SmreportsComponent,
    EoBomInventoryComponent,
    EoEcoStationReadinessComponent,
    EoFullScheduleComponent,
    EoPartShortageComponent,
    EoPoDiscrepancyComponent,
    EoPurchaseOrderComponent,
    EoRepairOrderComponent,
    EopurchaseorderComponent,
    EorepairorderComponent,
    EoCancelledPoComponent,
    SchedRotRepShortageComponent,
    SchedRotRepShortageCommentsComponent,
    BerReportComponent,
    JifReportComponent,
    AtaNavComponent,
    AssociatedMeNoStockComponent,
    AssociatedMeNoStockCommentComponent,
    AtaPartsSummaryComponent,
    ReplenishmentMatrixComponent,
    NewMeSetupOrChangesComponent,
    NewMeSetupOrChangesCommentsComponent,
    ScrapsComponent,
    ScrapsCommentsComponent,
    DateFormatsComponent,
    OnHoldEosComponent,
    LoginComponent,
    MaintSnackbarComponent,
    Im3NavMenuComponent,
    //MatAccordion,
    IoToolComponent,
    UserRoleComponent,
    MereviewComponent
  ],
  entryComponents: [
    CommentHistoryComponent,
    SmNextDueDateDetailComponent,
    MeSplitMeDetailComponent,
    SmCommentHistoryComponent,
    SmStationAddedShortageDetailComponent,
    SmPlannerCommentHistoryComponent,
    SmDash8CommentDetailsComponent,
    SmMinScheduledDateComponent,
    MeImqHpfDetailComponent,
    MeEcoHistoryComponent,
    MeEcoInsertHistoryComponent,
    EoStationShortageComponent,
    SpareAnalysisCommentHistoryComponent,
    EcoQueueAlertBottomSheetComponent,
    MeSummaryMePartNumberDetailsComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
      // useHash: true
}),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
