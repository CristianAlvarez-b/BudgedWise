class FinancialModel {
    constructor() {
        this.incomes = JSON.parse(localStorage.getItem('incomes')) || [];
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.updateBalance();
    }

    addIncome(name, value, date) {
        const income = { name, value, date };
        this.incomes.unshift(income);  // Agregar al principio del array
        localStorage.setItem('incomes', JSON.stringify(this.incomes)); // Guardar en localStorage
        this.updateBalance();
    }

    addExpense(name, value, date) {
        const expense = { name, value, date };
        this.expenses.unshift(expense);  // Agregar al principio del array
        localStorage.setItem('expenses', JSON.stringify(this.expenses)); // Guardar en localStorage
        this.updateBalance();
    }

    updateBalance() {
        this.totalIncome = this.incomes.reduce((total, income) => total + income.value, 0);
        this.totalExpense = this.expenses.reduce((total, expense) => total + expense.value, 0);
        this.balance = this.totalIncome - this.totalExpense;
        localStorage.setItem('balance', JSON.stringify(this.balance));
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
