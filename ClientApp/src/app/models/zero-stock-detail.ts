export class ZeroStockDetail {
    public ME_PART_NUMBER: string;
    public KEYWORD: string;
    public ZERO_STOCK_COUNT: number;
    public DaysInQueue: number;
    public ZERO_STOCK_STATION: string;
    public DASH8_DUE_IN: string;
    public DC: string;
    public ALLOCATION: string;
    public AvailableStockInDC: string;
    public NonAllocation_Station: string;
    public Overstock_Station: string;
    public Overdue_PO: number;
    public WithinTimeFrame_Po: number;
    public Overdue_RO: number;
    public WithinTimeFrame_RO: number;
    public PendingReview_SO: number;
    public LAST_UPDATES: Date;
    public COMMENTS: string;
}
