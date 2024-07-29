export class
    CommentReq {
    PLANNER_NAME: string;
    MENumber: string;
    REVIEW_REASON: string;
    STATIONS: Array<string>;
    Comment: string;
    TOGGLESTATUS: { id: number, status: string }[];
    REVIEWDATE: { id: number, reviewdate: string }[];
    // required key for baseline station shortage req  ME_PART_NUMBER || PZS.STATION || PZS.DASH8 || PZS.NOSE || PZS.IAG_SCHD
    // DASH8: string;
    // NOSE: string;
    // IAG_SCHD: string;
    // KIT_PART_NUMBER: string;
    // ORDER_NUMBER: string;
    // UPDATE_TIME: Date;
    //for post requests
    headers: any;
}
