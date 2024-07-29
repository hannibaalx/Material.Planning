export class OwnershipDetail {
    public ME_PART_NUMBER: string;
    public SERIAL_NUMBER: string;
    public TRACKING_NUMBER: number;
    public MFG_PART_NUMBER: string;
    // public MFG_SERIAL_NUMBER: string;
    public SERVICEABILITY_STATUS: string;
    // public INDEX_TYPE_CODE: string;
    public INDEX_TYPE_CODE_DESC: string;
    public ALPHA_STATION: string;
    public DSC: string;  
    public DS_DESC: string;
    public DS_CREW_NAME: string;//concatinate w/ DS_DESC
    public ACTIVITY_DATE: Date;
    public DATE_REMOVED: Date;
    public AIRCRAFT_REMOVED_FROM: string;
    public RO_NUMBER: string;
    public BUCKET: string;
    public RESP_PARTY: string;
    public RESP_STA: string;
    public LUS_PRSNEL_ID: string;
    public COMPNT_TRACK_LOC_TXT: string;
    public SHIP_FROM_STATION: string;
    public SPARE: string;
}
