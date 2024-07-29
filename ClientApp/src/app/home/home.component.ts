import { PersonnelInfo } from './../models/personnel-info';
import { Component, isDevMode, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { LoginComponent } from './login/login.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PingAuthenticationService } from '@techops-ui/ping-authentication';
import { now } from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  meurl: string ="";
  userInfo: string ="";
  //user: User = {DOMAIN: "", prsnel_id: "", FIRST_NAME: "", LAST_NAME: "", DISPLAY_NAME: "", EMAIL_ADDR_TXT:"", roles:[], PHONE: "", LAST_LOGGED_IN: ""};
  user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  userInputId: number= 0;
  //personnel: User = {employeenumber: "", first_name: "", last_name: "", LAST_NAME: "", DISPLAY_NAME: "", EMAIL_ADDR_TXT:"", roles:[], PHONE: "", LAST_LOGGED_IN: ""};
  //__user: PersonnelInfo = { prsnel_id: "", LAST_NAME: '', FIRST_NAME: '', EMAIL_ADDR_TXT: '', DISPLAY_NAME: '', LAST_LOGGED_IN: "" };
  __user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role:""  };
  prsnel_id: number= 0;
  LAST_NAME: string ="";
  FIRST_NAME: string ="";
  EMAIL_ADDR_TXT: string ="";
  DISPLAY_NAME: string ="";
  LAST_LOGGED_IN: string ="";
  tabTitle: string ="";
  resp: any;
  dialogValue: string ="";
  return: string = "";
       
  constructor(
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private pingService: PingAuthenticationService,
  ) { }
 
  ngOnInit() {
    const user = this.pingService.User;
    console.log(user);
    
    this.meurl = "https://tableau.aa.com/views/SupplyChainDepartmentLevelDashboard/Fill_Rate_and_Stores?:embed=y&:showVizHome=n&:toolbar=no&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:commentingEnabled=true&:reloadOnCustomViewSave=true&:showAppBanner=false&:isVizPortal=true&iframeSizedToWindow=true&:apiID=host1#navType=0&navSrc=Opt";

     // Get the query params
    this.route.queryParams
      .subscribe(params => {
        this.return = params['return'] || '/';
        //this.openLogin();
        // this.__user.employeenumber = this.user.employeenumber;
        // this.__user.first_name = this.user.first_name;
        // this.__user.last_name = this.user.last_name;
        // this.__user.display_name = this.__user.first_name + " " + this.__user.last_name;
        // this.__user.last_logged_in = now().toString();
        
        // this.userService.setPersonnelInfo(this.__user);
        // this.setWithExpiry("userInfo", this.__user, 3600000); //3600000 - 1hr, 43200000 - 12hrs, 86400000 - 24hrs
      });
    
  }

  setWithExpiry(key, value, ttl) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    // ttl is in milliseconds
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  openLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    dialogConfig.maxWidth = '400px';

    let dialogRef = this.dialog.open(
      LoginComponent, dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      if (isDevMode()) {
        this.tabTitle = "Inventory Manager 3 - Test Server";
        console.log('👋 Development');
      } else {
        this.tabTitle = "Inventory Manager 3";
        console.log('💪 Production');
      }      
      
      this.user = result;
      this.userInputId = result.data[0].id;
      this.dialogValue = result.data[0].lastupdatedtime;

      // this.userService.getADLSPersonnelInfoData(+this.user.employeenumber)
      //   .subscribe(result => {
      //     // this.__user.prsnel_id = result.prsnel_id.toString().padStart(6, '0');
      //     // this.__user.FIRST_NAME = result.FIRST_NAME;
      //     // this.__user.LAST_NAME = result.LAST_NAME;
      //     // this.__user.DISPLAY_NAME = result.DISPLAY_NAME;
      //     // this.__user.LAST_LOGGED_IN = this.dialogValue;
      //     // this.__user.employeenumber = this.user.employeenumber;
      //     // this.__user.first_name = this.user.first_name;
      //     // this.__user.last_name = this.user.last_name;
          
      //     // this.userService.setPersonnelInfo(this.__user);
      //     // setWithExpiry("userInfo", this.__user, 3600000); //3600000 - 1hr, 43200000 - 12hrs, 86400000 - 24hrs
      //     this.router.navigateByUrl(this.return);
      //   });
      });

    function getWithExpiry(key) {
      const itemStr = localStorage.getItem(key)

      // if the item doesn't exist, return null
      if (!itemStr) {
        return null
      }

      const item = JSON.parse(itemStr)
      const now = new Date()

      // compare the expiry time of the item with the current time
      if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
      }
      return item.value
    }
  }
}
