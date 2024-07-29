import { SmDeferralReviewComments } from "./sm-deferral-review-comments";

export class SmQueueCommentReq {
    public CHKKEY: string;
    public COMMENT: string;
    public CURRENT_USER: string;
    public PLANNER: string;
    public REVIEW_REASON: string;
    public NEXTREVIEWDATE: Date;
}
