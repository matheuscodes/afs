import { Expense } from '../models/Expense'

export const BOOKKEEPING = "bookkeeping";
export const ADD_EXPENSE = "add-expense";

export const addExpense = (expense: Expense) => {
  return {
    type: BOOKKEEPING,
    operation: ADD_EXPENSE,
    payload: expense,
  }
}
