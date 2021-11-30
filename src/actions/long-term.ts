import { Activity } from '../models/Activity'

export const LONG_TERM = "long-term";
export const LOAD_UPKEEPS = "load-upkeeps";
export const LOAD_SAVINGS = "load-savings";

export const loadUpkeeps = (upkeeps: any[]) => {
  console.log("upkeep", upkeeps);
  return {
    type: LONG_TERM,
    operation: LOAD_UPKEEPS,
    payload: upkeeps,
  }
}

export const loadSavings = (savings: Activity[]) => {
  return {
    type: LONG_TERM,
    operation: LOAD_SAVINGS,
    payload: savings,
  }
}
