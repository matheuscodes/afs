import { Activity } from '../models/Activity'

export const BOOKKEEPING = "bookkeeping";
export const ADD_ACTIVITY = "add-activity";
export const LOAD_ACTIVITIES = "load-activities";

export const addActivity = (activity: Activity) => {
  return {
    type: BOOKKEEPING,
    operation: ADD_ACTIVITY,
    payload: activity,
  }
}

export const loadActivities = (activities: Activity[]) => {
  return {
    type: BOOKKEEPING,
    operation: LOAD_ACTIVITIES,
    payload: activities,
  }
}
