export class ReportPurchaseOrderReq {
    public poStartDate: Date;
    public poEndDate: Date;
    public selectedPoStatus: string[];
    public selectedPoShipStation: string[];
    public selectedPoMen: string;
    public selectedPoMpn: string;
    public selectedPon: string;
}
