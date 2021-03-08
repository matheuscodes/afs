import { Activity } from '../models/Activity'

export const BOOKKEEPING = "bookkeeping";
export const ADD_EXPENSE = "add-activity";
export const LOAD_EXPENSES = "load-activities";

export const addActivity = (activity: Activity) => {
  return {
    type: BOOKKEEPING,
    operation: ADD_EXPENSE,
    payload: activity,
  }
}

export const loadActivities = (activities: Activity[]) => {
  return {
    type: BOOKKEEPING,
    operation: LOAD_EXPENSES,
    payload: activities,
  }
}
