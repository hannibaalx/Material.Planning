import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, timer } from 'rxjs';
import { UserRole } from 'src/app/models/user-role';
import { UserRoleService } from 'src/app/service/userrole.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
//import { PingAuthenticationService } from '@techops-ui/ping-authentication';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit{ 

  ngUserId: string = '';
  ngUserId_Admin: string = '';
  ngUserId_Supervisor: string = '';
  ngUserId_Viewer: string = '';
  ngUserId_User: string = '';
  userrole_displayedColumns: string[] = ['UserID', 'action'];
  userrole_dataSource_viewer! : MatTableDataSource<any>;
  userrole_dataSource_admin! : MatTableDataSource<any>;
  userrole_dataSource_supervisor! : MatTableDataSource<any>;
  userrole_dataSource_user! : MatTableDataSource<any>;
  public userroles$: Observable<UserRole[]>;
  loggedinuser: string = "";
  user: User;
  currentuser: string;

  constructor(
    private userroleService: UserRoleService,
    private snackbarService: SnackbarService,
    private snackBar: MatSnackBar 
  ) { }

  ngOnInit(): void {
    let temp = JSON.parse(localStorage.getItem('userInfo'));
    this.user = temp;
    this.currentuser = this.user.employeenumber;

    this.userroleService.getAllUserRoles()
    .subscribe((data) => { 
      this.userrole_dataSource_viewer = new MatTableDataSource(data.filter(data => data.IMRole === 'Viewer'));
      this.userrole_dataSource_admin =  new MatTableDataSource(data.filter(data => data.IMRole === 'Admin'));
      this.userrole_dataSource_supervisor = new MatTableDataSource(data.filter(data => data.IMRole === 'Supervisor'));
      this.userrole_dataSource_user =  new MatTableDataSource(data.filter(data => data.IMRole === 'User'));
    }); 
  }
  
  onDeleteButtonClick_Admin = (userId: string, rowIndex: number, imRole: string) =>
  {
    const success =  true;
    console.log("eventData: " + userId);
    console.log("rowIndex: " + rowIndex);
    this.userroleService.deleteUserIdFromRole(userId, imRole)
      .subscribe(suc => {
        console.log(suc);
        this.userrole_dataSource_admin.data.splice(rowIndex, 1);
        this.userrole_dataSource_admin._updateChangeSubscription();
        this.snackBar.open('User role successfully removed from the system', 'Close', {
          duration: 5000
        });
    },
    err => {
        console.log(err);
    });

  }

  onAddButtonClick_Admin = (userId: string, imRole: string) => {
    const success = true;
    console.log("eventData: " + userId);
    this.userroleService.addUserIdFromRole(userId, imRole, this.currentuser)
      .subscribe(suc => {
        console.log(suc);
        
        this.userroleService.getAllUserRoles()
          .subscribe((data) => {
            data = data.filter(data => data.IMRole === 'Admin');
            this.userrole_dataSource_admin = new MatTableDataSource(data);
          });
        this.ngUserId_Admin = ''; 
        this.snackbarService.success('User role successfully updated');
      },
        
        err => {
          console.log(err);
          if (err.status === 403)
          {
            this.ngUserId_Admin = ''; 
            this.snackbarService.error('User role already exists');
          }
        });
  }

  onDeleteButtonClick_Supervisor = (userId: string, rowIndex: number, imRole: string) =>
  {
    const success =  true;
    // console.log("eventData: " + userId);
    // console.log("rowIndex: " + rowIndex);
    this.userroleService.deleteUserIdFromRole(userId, imRole)
      .subscribe(suc => {
        console.log(suc);
        this.userrole_dataSource_supervisor.data.splice(rowIndex, 1);
        this.userrole_dataSource_supervisor._updateChangeSubscription();
        this.snackbarService.success('User role successfully removed from the system');
    },
    err => {
        console.log(err);
    });
  }

  onAddButtonClick_Supervisor = (userId: string, imRole: string) => {
    const success = true;
    console.log("eventData: " + userId);
    this.userroleService.addUserIdFromRole(userId, imRole, this.currentuser)
      .subscribe(suc => {
        console.log(suc);
        
        this.userroleService.getAllUserRoles()
          .subscribe((data) => {
            data = data.filter(data => data.IMRole === 'Supervisor');
            this.userrole_dataSource_supervisor = new MatTableDataSource(data);
          });
        this.ngUserId_Supervisor = ''; 
        this.snackbarService.success('User role successfully updated');
      },
        err => {
          console.log(err);
          if (err.status === 403) {
            this.ngUserId_Supervisor = '';
            this.snackbarService.error('User role already exists');
          }
        });
  }

  onDeleteButtonClick_Viewer = (userId: string, rowIndex: number, imRole: string) =>
  {
    const success =  true;
    console.log("eventData: " + userId);
    console.log("rowIndex: " + rowIndex);
    this.userroleService.deleteUserIdFromRole(userId, imRole)
      .subscribe(suc => {
        console.log(suc);
        this.userrole_dataSource_viewer.data.splice(rowIndex, 1);
        this.userrole_dataSource_viewer._updateChangeSubscription();
        this.snackbarService.success('User role successfully removed from the system');
    },
    err => {
        console.log(err);
    });
  }

  onAddButtonClick_Viewer = (userId: string, imRole: string) => {
    const success = true;
    console.log("eventData: " + userId);
    this.userroleService.addUserIdFromRole(userId, imRole, this.currentuser)
      .subscribe(suc => {
        console.log(suc);
        
        this.userroleService.getAllUserRoles()
          .subscribe((data) => {
            data = data.filter(data => data.IMRole === 'Viewer');
            this.userrole_dataSource_viewer = new MatTableDataSource(data);
          });
        this.ngUserId_Viewer = ''; 
        this.snackbarService.success('User role successfully updated');
      },
        err => {
          console.log(err);
            if (err.status === 403) {
              this.ngUserId_Viewer = '';
              this.snackbarService.error('User role already exists');
            }
        });
  }

  onDeleteButtonClick_User = (userId: string, rowIndex: number, imRole: string) =>
  {
    const success =  true;
    console.log("eventData: " + userId);
    console.log("rowIndex: " + rowIndex);
    this.userroleService.deleteUserIdFromRole(userId, imRole)
      .subscribe(suc => {
        console.log(suc);
        this.userrole_dataSource_user.data.splice(rowIndex, 1);
        this.userrole_dataSource_user._updateChangeSubscription();
        this.snackbarService.success('User role successfully removed from the system');
    },
    err => {
        console.log(err);
    });
  }

  onAddButtonClick_User = (userId: string, imRole: string) => {
    const success = true;
    console.log("eventData: " + userId);
    this.userroleService.addUserIdFromRole(userId, imRole, this.currentuser)
      .subscribe(suc => {
        console.log(suc);
        
        this.userroleService.getAllUserRoles()
          .subscribe((data) => {
            data = data.filter(data => data.IMRole === 'User');
            this.userrole_dataSource_user = new MatTableDataSource(data);
          });
        this.ngUserId_User = ''; 
        this.snackbarService.success('User role successfully updated');
      },
        err => {
          console.log(err);
            if (err.status === 403) {
              this.ngUserId_User = '';
              this.snackbarService.error('User role already exists');
            }
        });
  }
}