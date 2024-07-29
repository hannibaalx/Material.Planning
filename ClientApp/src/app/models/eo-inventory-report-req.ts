import { EoInventoryReportBomDetail } from './eo-inventory-report-bom-detail';
export class EoInventoryReportReq {
    public PLANNER: string;
    public EO_NUMBER: string;
    public EO_DESC: string;
    public NEW_EO_COMMENTS: string;
    public AIRCRAFT_COUNT: number;
    public BOM_DETAILS: EoInventoryReportBomDetail[];
}
