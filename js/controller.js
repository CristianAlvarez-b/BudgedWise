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
        this.model.updateBalance(); // Asegura que el balance se actualice en el modelo
        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());
    }

    getMovements() {
        let runningBalance = 0;
        const movements = [];

        // Procesar ingresos en orden inverso
        for (let i = this.model.incomes.length - 1; i >= 0; i--) {
            const income = this.model.incomes[i];
            runningBalance += income.value;
            movements.push({
                name: income.name,
                value: income.value,
                remaining: runningBalance,
                date: income.date,
                type: 'income'
            });
        }

        // Procesar egresos en orden inverso
        for (let i = this.model.expenses.length - 1; i >= 0; i--) {
            const expense = this.model.expenses[i];
            runningBalance -= expense.value;
            movements.push({
                name: expense.name,
                value: expense.value,
                remaining: runningBalance,
                date: expense.date,
                type: 'expense'
            });
        }

        return movements; // No es necesario invertir ya que procesamos en orden inverso
    }

    editMovement(index) {
        const movements = this.getMovements(); // Obtener movimientos en el orden correcto
        const movement = movements[index];

        // Calcular el índice real en la lista original según el tipo de movimiento
        if (movement.type === 'income') {
            const incomeIndex = this.model.incomes.length - (index + 1); // Ajustar para la lista de ingresos
            const newName = prompt("Edit name:", this.model.incomes[incomeIndex].name);
            const newValue = parseFloat(prompt("Edit value:", this.model.incomes[incomeIndex].value));
            const newDate = prompt("Edit date:", this.model.incomes[incomeIndex].date);

            if (newName && !isNaN(newValue) && newDate) {
                this.model.incomes[incomeIndex].name = newName;
                this.model.incomes[incomeIndex].value = newValue;
                this.model.incomes[incomeIndex].date = newDate;
                localStorage.setItem('incomes', JSON.stringify(this.model.incomes)); // Actualizar localStorage
            }
        } else {
            const expenseIndex = this.model.expenses.length - (index - (movements.length - this.model.expenses.length));
            const newName = prompt("Edit name:", this.model.expenses[expenseIndex].name);
            const newValue = parseFloat(prompt("Edit value:", this.model.expenses[expenseIndex].value));
            const newDate = prompt("Edit date:", this.model.expenses[expenseIndex].date);

            if (newName && !isNaN(newValue) && newDate) {
                this.model.expenses[expenseIndex].name = newName;
                this.model.expenses[expenseIndex].value = newValue;
                this.model.expenses[expenseIndex].date = newDate;
                localStorage.setItem('expenses', JSON.stringify(this.model.expenses)); // Actualizar localStorage
            }
        }
        this.updateView(); // Actualizar la vista con los cambios realizados
    }

    deleteMovement(index) {
        const movements = this.getMovements(); // Obtener movimientos en el orden correcto
        const movement = movements[index];

        // Calcular el índice real en la lista original según el tipo de movimiento
        if (movement.type === 'income') {
            const incomeIndex = this.model.incomes.length - (index + 1); // Ajustar para la lista de ingresos
            this.model.incomes.splice(incomeIndex, 1);
            localStorage.setItem('incomes', JSON.stringify(this.model.incomes)); // Actualizar localStorage
        } else {
            const expenseIndex = this.model.expenses.length - (index - (movements.length - this.model.expenses.length));
            this.model.expenses.splice(expenseIndex, 1);
            localStorage.setItem('expenses', JSON.stringify(this.model.expenses)); // Actualizar localStorage
        }

        this.updateView(); // Actualizar la vista con los cambios realizados
    }
}

// Inicializar la aplicación
new FinancialController(new FinancialModel(), new FinancialView());
