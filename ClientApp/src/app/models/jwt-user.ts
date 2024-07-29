export class JwtUser {
	client_id: string;
	iss: string;
	jti: string;
	sub: number;
	firstname: string;
	employeenumber: string;
	uid: number;
	amrcompany: string;
	amrappmfa: number;
	manager_id: number;
	amraccountype: string;
	authorize: string;
	costcenter: string;
	first_name: string;
	iat: number;
	last_name: string;
	given_name: string;
	lastname: string;
	samaccountname: number;
	amremployeestatus: number;
	aud: string;
	aagemployeestatus: string;
	BadgeNo: number;
	amrhiredate: Date;
	family_name: string;
	exp: number;

	constructor(json: any) {
		this.client_id = json.client_id;
		this.iss = json.iss;
		this.jti = json.jti;
		this.sub = json.sub;
		this.firstname = json.firstname;
		this.employeenumber = json.employeenumber;
		this.uid = json.uid;
		this.amrcompany = json.amrcompany;
		this.amrappmfa = json.amrappmfa;
		this.manager_id = json.manager_id;
		this.amraccountype = json.amraccountype;
		this.authorize = json.authorize;
		this.costcenter = json.costcenter;
		this.first_name = json.first_name;
		this.iat = json.iat;
		this.last_name = json.last_name;
		this.given_name = json.given_name;
		this.lastname = json.lastname;
		this.samaccountname = json.samaccountname;
		this.amremployeestatus = json.amremployeestatus;
		this.aud = json.aud;
		this.aagemployeestatus = json.aagemployeestatus;
		this.BadgeNo = json.BadgeNo;
		this.amrhiredate = json.amrhiredate;
		this.family_name = json.family_name;
		this.exp = json.exp;
	}
}