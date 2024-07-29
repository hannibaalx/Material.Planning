import { EoManageEoNoDash8Step2 } from './eo-manage-eo-no-dash8-step2';
import { EoManageEoNoDash8Step3 } from "./eo-manage-eo-no-dash8-step3";

export class EoUpdateEditManageEoNoDash8Req {
    public PLANNER: string;
    public EO_NUMBER: string;
    public EO_DESC: string;
    public NEW_EO_COMMENTS: string;
    public AIRCRAFT_COUNT: number;
    public BOM_DETAIL: EoManageEoNoDash8Step3[];
}
