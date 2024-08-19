import FinancialModel from './model.js';
import FinancialView from './view.js';

class FinancialController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.editingIndex = null; 

        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());

        this.initEventListeners();
        this.initLocalStorageListener();
    }

    initEventListeners() {
        const popup = document.getElementById('popup-form');
        const closePopup = document.getElementById('close-popup');

        document.querySelector('.btn-add-income').addEventListener('click', () => {
            this.showForm('income');
        });

        document.querySelector('.btn-add-expense').addEventListener('click', () => {
            this.showForm('expense');
        });

        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });

        document.getElementById('income-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('income-name').value;
            const value = parseFloat(document.getElementById('income-value').value);
            const date = document.getElementById('income-date').value;
        
            if (name && !isNaN(value) && date) {
                if (this.editingIndex !== null) {
                    this.updateMovement('income', name, value, date);
                } else {
                    this.model.addIncome(name, value, date);
                }
                this.updateView();
                this.hideForm();
            }
        });

        document.getElementById('expense-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('expense-name').value;
            const value = parseFloat(document.getElementById('expense-value').value);
            const date = document.getElementById('expense-date').value;
            
            if (name && !isNaN(value) && date) {
                if (this.editingIndex !== null) {
                    this.updateMovement('expense', name, value, date);
                } else {
                    this.model.addExpense(name, value, date);
                }
                this.updateView();
                this.hideForm();
            }
        });

        this.view.setEditHandler(this.editMovement.bind(this));
        this.view.setDeleteHandler(this.deleteMovement.bind(this));
    }
    
    initLocalStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'balance') {
                this.model.balance = parseFloat(event.newValue) || 0;
                this.updateView();
            }
        });
    }

    showForm(type, movement = null) {
        const popup = document.getElementById('popup-form');
        document.getElementById('income-form').style.display = type === 'income' ? 'flex' : 'none';
        document.getElementById('expense-form').style.display = type === 'expense' ? 'flex' : 'none';
        popup.style.display = 'block';

        if (movement) {
            document.getElementById(`${type}-name`).value = movement.name;
            document.getElementById(`${type}-value`).value = movement.value;
            document.getElementById(`${type}-date`).value = movement.date.split(' ')[0];
            this.editingIndex = movement.index;
        } else {
            this.editingIndex = null;
        }
    }

    hideForm() {
        document.getElementById('popup-form').style.display = 'none';
        document.getElementById('income-form').reset();
        document.getElementById('expense-form').reset();
    }

    updateMovement(type, name, value, date) {
        const movements = this.getMovements();
        const movement = movements[this.editingIndex];

        if (type === 'income') {
            const realIndex = this.model.incomes.findIndex(income => 
                income.name === movement.name && 
                income.value === movement.value && 
                income.date === movement.date
            );
            if (realIndex !== -1) {
                this.model.incomes[realIndex] = { name, value, date };
                localStorage.setItem('incomes', JSON.stringify(this.model.incomes));
            }
        } else {
            const realIndex = this.model.expenses.findIndex(expense => 
                expense.name === movement.name && 
                expense.value === movement.value && 
                expense.date === movement.date
            );
            if (realIndex !== -1) {
                this.model.expenses[realIndex] = { name, value, date };
                localStorage.setItem('expenses', JSON.stringify(this.model.expenses));
            }
        }
        this.editingIndex = null;
    }
    
    updateView() {
        this.model.updateBalance(); // Asegura que el balance se actualice en el modelo
        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());
    }

    getMovements() {
        let runningBalance = 0;
        const movements = [];
    
        // Combinar ingresos y egresos en un solo array
        const allMovements = [
            ...this.model.incomes.map(income => ({ ...income, type: income.type || 'income' })),
            ...this.model.expenses.map(expense => ({ ...expense, type: expense.type || 'expense' }))
        ];
        // Ordenar por fecha y hora en orden descendente
        allMovements.sort((a, b) => new Date(a.date) - new Date(b.date));
    
        // Procesar todos los movimientos ordenados
        allMovements.forEach(movement => {
            if (movement.type === 'income' || movement.type === 'pocketIncome') {
                runningBalance += movement.value;
            } else if (movement.type === 'expense' || movement.type === 'pocketOutcome') {
                runningBalance -= movement.value;
            }
    
            movements.push({
                name: movement.name,
                value: movement.value,
                remaining: runningBalance,
                date: movement.date,
                type: movement.type
            });
        });
    
        return movements;
    }
    
    editMovement(index) {
        const movements = this.getMovements();
        const movement = movements[index];
        this.showForm(movement.type, movement);
    }
    
    deleteMovement(index) {
        const movements = this.getMovements();
        const movement = movements[index];
    
        if (movement.type === 'income') {
            const realIndex = this.model.incomes.findIndex(income => 
                income.name === movement.name && 
                income.value === movement.value && 
                income.date === movement.date
            );
            if (realIndex !== -1) {
                this.model.incomes.splice(realIndex, 1);
                localStorage.setItem('incomes', JSON.stringify(this.model.incomes));
            }
        } else {
            const realIndex = this.model.expenses.findIndex(expense => 
                expense.name === movement.name && 
                expense.value === movement.value && 
                expense.date === movement.date
            );
            if (realIndex !== -1) {
                this.model.expenses.splice(realIndex, 1);
                localStorage.setItem('expenses', JSON.stringify(this.model.expenses));
            }
        }
        this.updateView();
    }
}

// Inicializar la aplicación
new FinancialController(new FinancialModel(), new FinancialView());
