export class EoSupervisorQueueDetail {
    public PLANNER: string;
    public EO_NUMBER: string;
    public ME_TYPE: string;
    public AD_IND: string;
    public DASH_8: string;
    public EO_DESC: string;
    public DAYSINQUEUE: number;

//YESTERDAY DEFFERALS
    public STATION: string;
    public NOSE: string;
    public SUBFLEET: string;
    //public DASH_8
    public EO_NBR: string;
    public TASK_DESC: string;
    public CARRIER: string;
    public REASON: string;
    //public PLANNER: string;
    public DATA_SOURCE: string;

//LAST 12 MONTH DEFERRAL HISTORY
    //public DASH_8
    //public EO_NBR
    //public TASK_DESC
    //public SUBFLEET
    //public CARRIER
    public INSUFFICIENT_MANPOWER: number;
    public PARTS_NIS_ALLOCATED: number;
    public ALLOCATED_TOOLING_NIS_USV: number;
    public TOTAL_DEFERRALS: number;
}
