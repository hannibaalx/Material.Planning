export class SmSearchDetails {
    //begin request properties
    public FLEET: string;
    public DASH_8: string;
    public DASH8_DESC: string;
    public TSX_CHECKTYPE: string;
    public TSX_WCNUM: string;
    // public TSX_ALTNUM: string;
    public STATION_REQUIREMENT: string;
    public NEW_SM_PARTS_TTL_REQ: string;
    //end request properties

    //begin result properties
    // public FLEET: string;
    // public DASH8_DESC: string;
    // public TSX_CHECKTYPE: string;
    // public TSX_WCNUM: string;
    // public STATION_REQUIREMENT: string;
    public AUTH_STA: string;
    public MIN_SCHDLD_DATE: Date;
    public DASH8_COMMENT: string;
    public WC_COMMENT: string;
    // public ALT_COMMENT: string;
    public ORDERBY: string;
    public SORTTYPE: string;
    //end result properties
}
