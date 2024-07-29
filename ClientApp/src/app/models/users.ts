import { now } from "moment";

export class Users {

  //let dateTime = moment().format('YYYY-DD-MM, hh:mm');
  employeenumber: string;
  first_name: string;
  last_name: string;
  display_name: string;
  last_logged_in: string;
  role: string;

  constructor(json: any) {
    this.employeenumber = json.employeenumber;
    this.first_name = json.first_name;
    this.last_name = json.last_name;
    this.display_name = this.first_name + " " + this.last_name;
    this.last_logged_in = now().toString();
    this.role = "";
  }
}


