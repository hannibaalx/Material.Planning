import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PingAuthenticationModule } from '@techops-ui/ping-authentication';
import { PfloginService } from './service/pflogin.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { PartService } from './service/part.service';
import { PlannerService } from './service/planner.service';
import { UserService } from './service/user.service';
import { EcoService } from './service/eco.service';
import { SmPlannerQueueService } from './service/sm-planner-queue.service';
import { SchedmaintService } from './service/schedmaint.service';
import { ReportService } from './service/report.service';
import { eoPlannerService } from './service/eoPlanner.service';
import { EoSupervisorViewService } from './service/eo-supervisor-view.service';
import { EoReportService } from './service/eo-report.service';
import { LoggerService } from './service/logger.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CacheControlService } from './service/cache-control.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule} from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    PingAuthenticationModule.forRoot(environment.ping),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatTreeModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
  ],
  
  providers: [PartService, PlannerService, UserService, EcoService, ReportService, SchedmaintService,
    SmPlannerQueueService, eoPlannerService, EoSupervisorViewService, LoggerService, EoReportService,
    PfloginService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheControlService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggerService, multi: true },
  ],
    
  bootstrap: [AppComponent]
})
export class AppModule {
  sbOpened: boolean = false;
  
 }
