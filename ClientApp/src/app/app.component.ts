import { UserInfo } from './models/user-info';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PingAuthenticationService } from '@techops-ui/ping-authentication';
import { BnNgIdleService } from 'bn-ng-idle';
import * as moment from 'moment';
import { JwtUser } from './models/jwt-user';
import { UserService } from './service/user.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PfloginService } from './service/pflogin.service';
import { UserRoleService } from 'src/app/service/userrole.service';

declare let process: any;

interface SideNode {
  name: string;
  url?: string;
  link?: SideNode[];
}

const TREE_DATA: SideNode[] = [
  {
    name: 'Search',
    link: [
      { name: 'M&E/MPN', url: '/ata' },
      { name: 'EO', url: '/eo/search' },
      { name: 'Card/Check', url: '/sm/sm-search' },
    ]
  },
  {
    name: 'Queues',
    link: [
      { name: 'ATA', url: '/plq' },
      { name: 'EO', url: '/eo/plq' },
      { name: 'Fleet', url: '/sm/sm-plq' }
    ] 
  },
  {
    name: 'Reports',
    link: [
      { name: 'General', url: 'report/general' },
      { name: 'ATA', url: 'report/ata' },
      { name: 'EO', url: 'report/eo' },
      { name: 'Manage EO no Dash 8', url: '/eo/managenodash8' },
      { name: 'Supervisor View (EO)' , url: '/eo/supervisorview'}
    ]
  }
  // ,
  // {
  //   name: 'Roles',
  //   link: [
  //     {
  //       name: 'User Roles', url: '/userrole'
  //     }
  //   ]
  // }
  
];

const VIEWER_TREE_DATA: SideNode[] = [
  {
    name: 'Search',
    link: [
      { name: 'M&E/MPN', url: '/ata' },
      { name: 'EO', url: '/eo/search' },
      { name: 'Card/Check', url: '/sm/sm-search' },
    ]
  },
  {
    name: 'Reports',
    link: [
      { name: 'General', url: 'report/general' },
      { name: 'ATA', url: 'report/ata' },
      { name: 'EO', url: 'report/eo' },
      { name: 'Manage EO no Dash 8', url: '/eo/managenodash8' },
      { name: 'Supervisor View (EO)', url: '/eo/supervisorview' }
    ]
  }];

  const ADMIN_TREE_DATA: SideNode[] = [
    {
      name: 'Search',
      link: [
        { name: 'M&E/MPN', url: '/ata' },
        { name: 'EO', url: '/eo/search' },
        { name: 'Card/Check', url: '/sm/sm-search' },
      ]
    },
    {
      name: 'Queues',
      link: [
        { name: 'ATA', url: '/plq' },
        { name: 'EO', url: '/eo/plq' },
        { name: 'Fleet', url: '/sm/sm-plq' }
      ] 
    },
    {
      name: 'Reports',
      link: [
        { name: 'General', url: 'report/general' },
        { name: 'ATA', url: 'report/ata' },
        { name: 'EO', url: 'report/eo' },
        { name: 'Manage EO no Dash 8', url: '/eo/managenodash8' },
        { name: 'Supervisor View (EO)' , url: '/eo/supervisorview'}
      ]
    } ,
     {
       name: 'Roles',
       link: [
         {
           name: 'User Roles', url: '/userrole'
         }
       ]
     }
  ];
interface SideFlatNode {
  expandable: boolean;
  name: string;
  url: string;
  level: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements OnInit {
  private _transformer = (node: SideNode, level: number) => {
    return {
      expandable: !!node.link && node.link.length > 0,
      name: node.name,
      url: node.url,
      level: level,
    };
  }

  _userrolefromservice: string;
  treeControl = new FlatTreeControl<SideFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.link);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  userInfo: string;
  tabTitle: string;
  showFiller = false;
  userInitials: string;
  _user: User = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role: "" };
  currentUTC = moment.utc();
  //domain: string = '';
  adminlink: boolean;
  _viewercheck: boolean = true;
  domain: string = "";
  clientId: string = '';
  jwtTokenValue: string = "";
  jwtUser: JwtUser = {
    "client_id": "",
    "iss": "",
    "jti": "",
    "sub": 0,
    "firstname": "",
    "employeenumber": "",
    "uid": 0,
    "amrcompany": "",
    "amrappmfa": 0,
    "manager_id": 0,
    "amraccountype": "",
    "authorize": "",
    "costcenter": "",
    "first_name": "",
    "iat": 0,
    "last_name": "",
    "given_name": "",
    "lastname": "",
    "samaccountname": 0,
    "amremployeestatus": 0,
    "aud": "",
    "aagemployeestatus": "",
    "BadgeNo": 0,
    "amrhiredate": null,
    "family_name": "",
    "exp": 0
  };
  logOutUrl$: Observable<string>;
  UserRoleService: any;
     
  constructor( 
    private userService: UserService,
    private route: Router,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private pingService: PingAuthenticationService,
    private pingAuth: PingAuthenticationService,
    private pfloginservice: PfloginService,
    private userRoleService: UserRoleService,
    
    @Inject(DOCUMENT) private document: any
    ) {
    this.dataSource.data = TREE_DATA;
    this.pingAuth.profile$.subscribe(() => {
      {
        this.logOutUrl$ = combineLatest([this.pingAuth.profile$, this.pingAuth.identity$]).pipe(
        map(([profile, identity]) => {
          console.log(`https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`);
          return `https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`;
          })
        ); 
      }
    })
  }


  
  hasChild = (_: number, node: SideFlatNode) => node.expandable;
  
  ngOnInit(): void{


    //this.logOutUrl$ = this.pfloginService.getPingAuth();    

    //console.log(this.document.location.hostname);
    this.bnIdle.startWatching(54000).subscribe((isTimedOut: boolean) => { //60 seconds, 3600 1hr, 54000 15hr
      if (isTimedOut) {
        console.log('session expired');
        localStorage.removeItem('userInfo');
        this.userService.clearUser();
        this.refresh();
      }
    });
    
    //test to get id_token
    // this.pingService.identity$.subscribe(x => { x.id_token });
    // this.pingAuth.identity$.subscribe(y => { y.id_token });
      //value => console.log('Observable emitted the next value: ' + value),

    this.pingAuth.profile$.subscribe(user => {
      //get sso info
      this.jwtUser = user;
      //console.log("jwtuser -->" + this.jwtUser);
      //this.userInitials = this.jwtUser.first_name.charAt(0) + this.jwtUser.last_name.charAt(0);
      this.userInitials = this.jwtUser.first_name.charAt(0) + this.jwtUser.last_name.charAt(0);
      this._user = this.getWithExpiry('userInfo');
      this.userService.setPersonnelInfo(this._user);
      //this._user.role = 'Viewer';
      if (this._user == null) {
        // this.userService.getPersonnelInfo()
        //   .subscribe(data => {
        this._user = { employeenumber: "", first_name: "", last_name: "", display_name: "", last_logged_in: "", role: "" };
        this._user.employeenumber = this.jwtUser.employeenumber;
        this._user.first_name = this.jwtUser?.first_name?.toUpperCase();
        this._user.last_name = this.jwtUser.last_name?.toUpperCase(); 
          
        this._user.display_name = this._user.first_name + " " + this._user.last_name;
        this._user.last_logged_in = this.currentUTC.local().format('yyyy-MM-DD HH:mm');
        let localstorage = JSON.stringify(this._user);
        localStorage.setItem('userInfo', localstorage);
        //localStorage.setItem('userInfo', '{ "employeenumber:" "", "first_name:" "", "last_name:" "", "display_name:" "", "last_logged_in:" "" }');
        /*this.userRoleService.getUserRole(this._user.employeenumber).subscribe(
          values => {
            if (values.length)
            {
              console.log("Object returned" + values);
              this._user.role = values[0].IMRole;
              this._userrolefromservice = values[0].IMRole;
              console.log("role assigned is " + this._user.role);
              localStorage.setItem('userInfo', JSON.stringify(this._user));     
              if (values[0].IMRole === 'Viewer')
              {
                this.dataSource.data = TREE_DATA;
              }
              else if (values[0].IMRole === 'Admin')
              {
                this.dataSource.data = TREE_DATA;
                }
            }     
            else {
              console.log("UserId doesn't exist in database");
              this._user.role = 'Viewer';
              console.log("set user with Viewer Role. Stringify object is: " + JSON.stringify(this._user));
              localStorage.setItem('userInfo', JSON.stringify(this._user));              
              this.dataSource.data = TREE_DATA;
            }
            error => {
              console.log('Error in calling getuserrole', error);
              console.log('test');
            }
            //let localstorage = JSON.stringify(this._user);
            //localStorage.setItem('role', this._user.role);
            //localStorage.setItem('userInfo', localstorage);
          }
        );*/
        console.log("After setting localstorage logging again Stringify " + JSON.stringify(this._user));
        //let localstorage = JSON.stringify(this._user);
        //localStorage.setItem('userInfo', localstorage);
            //this.userInitials = this._user.first_name.charAt(0) + this._user.last_name.charAt(0);
          // });
      }
      
      /*this.userRoleService.getIsAdminUserRole(this._user.employeenumber).subscribe(data => {
        this.adminlink = data.length > 0 ? true : false;
       })  */ 
    });
  }

  getWithExpiry(key) {
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

  signOut() {
    this.pingAuth.endSession();
    this.userService.clearUser();  
    localStorage.clear();
    sessionStorage.removeItem('access_token');
    sessionStorage.clear();

    this.pingAuth.profile$.subscribe(() => {
      {
        this.logOutUrl$ = combineLatest([this.pingAuth.profile$, this.pingAuth.identity$]).pipe(
          map(([profile, identity]) => {              console.log(`https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`);
              //return `https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}&TargetResource=${encodeURIComponent(window.location.origin)}`;
              return `https://pfloginapp.cloud.aa.com/api/logout?id_token_hint=${identity.id_token}}`;
              })
            ); 
          }
        })
      }

  refresh(): void {
    window.location.reload();
  }

  // log(state: string) {
  //   console.log(state);  
  // }

}
