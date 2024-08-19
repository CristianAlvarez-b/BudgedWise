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
                const currentTime = new Date().toLocaleTimeString('en-GB'); 
                const dateTime = `${date} ${currentTime}`;
        
                this.model.addIncome(name, value, dateTime);
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
                const currentTime = new Date().toLocaleTimeString('en-GB'); 
                const dateTime = `${date} ${currentTime}`;
        
                this.model.addExpense(name, value, dateTime);
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
        this.model.updateBalance(); 
        this.view.updateBalance(this.model.balance);
        this.view.updateMovements(this.getMovements());
    }

    getMovements() {
        let runningBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const movements = [];
    
        // Combinar ingresos y egresos en un solo array
        const allMovements = [
            ...this.model.incomes.map(income => ({ ...income, type: 'income' })),
            ...this.model.expenses.map(expense => ({ ...expense, type: 'expense' }))
        ];
    
        // Ordenar por fecha y hora en orden descendente
        allMovements.sort((a, b) => new Date(a.date) - new Date(b.date));
    
        // Procesar todos los movimientos ordenados
        allMovements.forEach(movement => {
            if (movement.type === 'income') {
                runningBalance += movement.value;
            } else {
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
    
        if (movement.type === 'income') {
            const realIndex = this.model.incomes.findIndex(income => 
                income.name === movement.name && 
                income.value === movement.value && 
                income.date === movement.date
            );
    
            const newName = prompt("Edit name:", this.model.incomes[realIndex].name);
            const newValue = parseFloat(prompt("Edit value:", this.model.incomes[realIndex].value));
            const newDate = prompt("Edit date:", this.model.incomes[realIndex].date);
    
            if (newName && !isNaN(newValue) && newDate) {
                this.model.incomes[realIndex].name = newName;
                this.model.incomes[realIndex].value = newValue;
                this.model.incomes[realIndex].date = newDate;
                localStorage.setItem('tempIncomes', JSON.stringify(this.model.incomes));
            }
        } else {
            const realIndex = this.model.expenses.findIndex(expense => 
                expense.name === movement.name && 
                expense.value === movement.value && 
                expense.date === movement.date
            );
    
            const newName = prompt("Edit name:", this.model.expenses[realIndex].name);
            const newValue = parseFloat(prompt("Edit value:", this.model.expenses[realIndex].value));
            const newDate = prompt("Edit date:", this.model.expenses[realIndex].date);
    
            if (newName && !isNaN(newValue) && newDate) {
                this.model.expenses[realIndex].name = newName;
                this.model.expenses[realIndex].value = newValue;
                this.model.expenses[realIndex].date = newDate;
                localStorage.setItem('tempExpenses', JSON.stringify(this.model.expenses));
            }
        }
        this.updateView();
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
                localStorage.setItem('tempIncomes', JSON.stringify(this.model.incomes));
            }
        } else {
            const realIndex = this.model.expenses.findIndex(expense => 
                expense.name === movement.name && 
                expense.value === movement.value && 
                expense.date === movement.date
            );
    
            if (realIndex !== -1) {
                this.model.expenses.splice(realIndex, 1);
                localStorage.setItem('tempExpenses', JSON.stringify(this.model.expenses));
            }
        }
        this.updateView();
    }

}

new FinancialController(new FinancialModel(), new FinancialView());