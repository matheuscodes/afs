import { Upkeep } from '../models/Upkeep'

export const LONG_TERM = "long-term";
export const LOAD_UPKEEPS = "load-activities";

export const loadUpkeeps = (upkeeps: Upkeep[]) => {
  return {
    type: LONG_TERM,
    operation: LOAD_UPKEEPS,
    payload: upkeeps,
  }
}
