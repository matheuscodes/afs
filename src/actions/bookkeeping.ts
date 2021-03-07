import { Expense } from '../models/Expense'

export const BOOKKEEPING = "bookkeeping";
export const ADD_EXPENSE = "add-expense";
export const LOAD_EXPENSES = "load-expenses";

export const addExpense = (expense: Expense) => {
  return {
    type: BOOKKEEPING,
    operation: ADD_EXPENSE,
    payload: expense,
  }
}

export const loadExpenses = (expenses: Expense[]) => {
  return {
    type: BOOKKEEPING,
    operation: LOAD_EXPENSES,
    payload: expenses,
  }
}
