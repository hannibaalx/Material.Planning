import { EoExistingDash8 } from './eo-existing-dash8';
import { EoManageAlternativePartStep2Child } from "./eo-manage-alternative-part-step2-child";

export class EoManageAlternativePartStep2 {
    public DASH_8: string;
    public ME_PART_NUMBER_USED: string;
    public PRIME_MPN: string;
    public QTY_REQ: number;
    public REQD_IND: boolean;
    public KEYWORD_DESCRIPTION: string;
    public CHILDREN: EoManageAlternativePartStep2Child[];
}
