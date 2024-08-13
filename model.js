// model.js

class FinancialModel {
    constructor() {
        this.incomes = [];
        this.expenses = [];
    }

    addIncome(name, value, date) {
        const income = { name, value, date };
        this.incomes.push(income);
        this.updateBalance();
    }

    addExpense(name, value, date) {
        const expense = { name, value, date };
        this.expenses.push(expense);
        this.updateBalance();
    }

    updateBalance() {
        this.totalIncome = this.incomes.reduce((total, income) => total + income.value, 0);
        this.totalExpense = this.expenses.reduce((total, expense) => total + expense.value, 0);
        this.balance = this.totalIncome - this.totalExpense;
    }

    getMovements() {
        return {
            incomes: this.incomes,
            expenses: this.expenses,
            balance: this.balance
        };
    }
}

export default FinancialModel;
