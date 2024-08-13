import FinancialModel from './model.js';
import FinancialView from './view.js';

class FinancialController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());

        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelector('.btn-add-income').addEventListener('click', () => {
            document.getElementById('income-form').style.display = 'block';
            document.getElementById('expense-form').style.display = 'none';
        });

        document.querySelector('.btn-add-expense').addEventListener('click', () => {
            document.getElementById('expense-form').style.display = 'block';
            document.getElementById('income-form').style.display = 'none';
        });

        document.getElementById('income-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('income-name').value;
            const value = parseFloat(document.getElementById('income-value').value);
            const date = document.getElementById('income-date').value;

            if (name && !isNaN(value) && date) {
                this.model.addIncome(name, value, date);
                this.updateView();
                document.getElementById('income-form').reset();
                document.getElementById('income-form').style.display = 'none';
            }
        });

        document.getElementById('expense-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('expense-name').value;
            const value = parseFloat(document.getElementById('expense-value').value);
            const date = document.getElementById('expense-date').value;

            if (name && !isNaN(value) && date) {
                this.model.addExpense(name, value, date);
                this.updateView();
                document.getElementById('expense-form').reset();
                document.getElementById('expense-form').style.display = 'none';
            }
        });

        this.view.setEditHandler(this.editMovement.bind(this));
        this.view.setDeleteHandler(this.deleteMovement.bind(this));
    }

    updateView() {
        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());
    }

    getMovements() {
        const incomes = this.model.incomes.map(income => ({
            name: income.name,
            value: income.value,
            remaining: this.model.balance,
            date: income.date,
            type: 'income'
        }));

        const expenses = this.model.expenses.map(expense => ({
            name: expense.name,
            value: expense.value,
            remaining: this.model.balance,
            date: expense.date,
            type: 'expense'
        }));

        return [...incomes, ...expenses];
    }

    editMovement(index) {
        const movements = this.getMovements();
        const movement = movements[index];

        const newName = prompt("Edit name:", movement.name);
        const newValue = parseFloat(prompt("Edit value:", movement.value));
        const newDate = prompt("Edit date:", movement.date);

        if (newName && !isNaN(newValue) && newDate) {
            if (movement.type === 'income') {
                this.model.incomes[index].name = newName;
                this.model.incomes[index].value = newValue;
                this.model.incomes[index].date = newDate;
            } else {
                this.model.expenses[index - this.model.incomes.length].name = newName;
                this.model.expenses[index - this.model.incomes.length].value = newValue;
                this.model.expenses[index - this.model.incomes.length].date = newDate;
            }
            this.updateView();
        }
    }

    deleteMovement(index) {
        const movements = this.getMovements();
        const movement = movements[index];

        if (movement.type === 'income') {
            this.model.incomes.splice(index, 1);
        } else {
            this.model.expenses.splice(index - this.model.incomes.length, 1);
        }

        this.updateView();
    }
}

// Inicializar la aplicación
new FinancialController(new FinancialModel(), new FinancialView());
