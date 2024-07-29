export class UserRole {

  permissionID: string;
  userID: string;
  IMRole: string;
  LastUpdated: string;
  UpdatedBy: string;

  constructor(json: any) {
    this.permissionID = json.permissionID;
    this.userID = json.userID;
    this.IMRole = json.IMRole;
    this.LastUpdated = this.LastUpdated;
    this.UpdatedBy = this.UpdatedBy;
  }
}
