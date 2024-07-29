import { now } from "moment";
export class SmDeferralReviewComments {
    public DEFREASON: string;
    public ROOT_CAUSE_ASSIGNED: string;
    public WCNUMBER: string;
    public PART_DESC: string;
    public QTY: number;
    public REQ_IND: string;
    public REVIEWED_DEFERRAL_CODE: string;
    public MODDATE: string;
    public STATUS: string;
    public CHEKEY: string;
    public CHKKEY: string;
    // public COMMENT: string;
    // public CURRENT_USER: string;
    // public PLANNER: string;
    // public REVIEW_REASON: string;

    constructor(json: any) {
        this.WCNUMBER = json.WCNUMBER;
        this.PART_DESC = json.PART_DESC;
        this.QTY = json.QTY;
        this.REQ_IND = json.REQ_IND;
        this.REVIEWED_DEFERRAL_CODE = json.REVIEWED_DEFERRAL_CODE;
        this.MODDATE = now().toString();
        this.STATUS = json.STATUS;
        this.CHEKEY = json.CHEKEY;
        this.CHKKEY = json.CHEKKEY;
    }

}
