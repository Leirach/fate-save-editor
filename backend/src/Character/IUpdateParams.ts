import { BasicStats } from "./BasicStats";
import { LvlStats } from "./LvlStats";
import { SkillSet } from "./SkillSet";

export interface IUpdateParams {
    name?: string,
    basic?: Partial<BasicStats>,
    skills?: Partial<SkillSet>,
    stats?: Partial<LvlStats>
}