import FinancialModel from './modelBudget.js';
import FinancialView from './viewBudget.js';

class FinancialController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());

        this.initEventListeners();
        this.initLocalStorageListener();
    }

    initEventListeners() {
        const popup = document.getElementById('popup-form');
        const closePopup = document.getElementById('close-popup');

        document.querySelector('.btn-add-income').addEventListener('click', () => {
            document.getElementById('income-form').style.display = 'flex';
            document.getElementById('expense-form').style.display = 'none';
            popup.style.display = 'block';
        });

        document.querySelector('.btn-add-expense').addEventListener('click', () => {
            document.getElementById('expense-form').style.display = 'flex';
            document.getElementById('income-form').style.display = 'none';
            popup.style.display = 'block';
        });

        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == popup) {
                popup.style.display = 'none';
            }
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
                popup.style.display = 'none';
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
                popup.style.display = 'none';
            }
        });

        this.view.setEditHandler(this.editMovement.bind(this));
        this.view.setDeleteHandler(this.deleteMovement.bind(this));
    }
    
    initLocalStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'TempBalance') {
                this.model.balance = JSON.parse(event.newValue);
                this.updateView();
            }
        });
    }

    updateView() {
        this.model.updateBalance(); // Asegura que el balance se actualice en el modelo
        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());
    }

    getMovements() {
        let runningBalance = parseFloat(localStorage.getItem('balance')) || 0;
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
            const realIndex = this.model.incomes.length - 1 - index; // Ajustar para la lista de ingresos
            const newName = prompt("Edit name:", this.model.incomes[realIndex].name);
            const newValue = parseFloat(prompt("Edit value:", this.model.incomes[realIndex].value));
            const newDate = prompt("Edit date:", this.model.incomes[realIndex].date);

            if (newName && !isNaN(newValue) && newDate) {
                this.model.incomes[realIndex].name = newName;
                this.model.incomes[realIndex].value = newValue;
                this.model.incomes[realIndex].date = newDate;
                localStorage.setItem('tempIncomes', JSON.stringify(this.model.incomes)); // Actualizar localStorage
            }
        } else {
            const realIndex = this.model.expenses.length - 1 - (index - this.model.incomes.length); // Ajustar para la lista de gastos
            const newName = prompt("Edit name:", this.model.expenses[realIndex].name);
            const newValue = parseFloat(prompt("Edit value:", this.model.expenses[realIndex].value));
            const newDate = prompt("Edit date:", this.model.expenses[realIndex].date);

            if (newName && !isNaN(newValue) && newDate) {
                this.model.expenses[realIndex].name = newName;
                this.model.expenses[realIndex].value = newValue;
                this.model.expenses[realIndex].date = newDate;
                localStorage.setItem('tempExpenses', JSON.stringify(this.model.expenses)); // Actualizar localStorage
            }
        }
        this.updateView(); // Actualizar la vista con los cambios realizados
    }

    deleteMovement(index) {
        const movements = this.getMovements(); // Obtener movimientos en el orden correcto
        const movement = movements[index];

        // Calcular el índice real en la lista original según el tipo de movimiento
        if (movement.type === 'income') {
            const realIndex = this.model.incomes.length - 1 - index; // Ajustar para la lista de ingresos
            this.model.incomes.splice(realIndex, 1);
            localStorage.setItem('tempIncomes', JSON.stringify(this.model.incomes)); // Actualizar localStorage
        } else {
            const realIndex = this.model.expenses.length - 1 - (index - this.model.incomes.length); // Ajustar para la lista de gastos
            this.model.expenses.splice(realIndex, 1);
            localStorage.setItem('tempExpenses', JSON.stringify(this.model.expenses)); // Actualizar localStorage
        }

        this.updateView(); // Actualizar la vista con los cambios realizados
    }

}

// Inicializar la aplicación
new FinancialController(new FinancialModel(), new FinancialView());