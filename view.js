// view.js

class FinancialView {
    constructor() {
        this.amountElement = document.querySelector('.amount h2');
        this.movementsTableBody = document.querySelector('.movements-table tbody');
    }

    updateBalance(balance) {
        this.amountElement.textContent = `$${balance.toLocaleString()} COP`;
    }

    updateMovements(movements) {
        this.movementsTableBody.innerHTML = '';

        movements.forEach(movement => {
            const row = document.createElement('tr');
            const icon = movement.type === 'income' ? '⬆️' : '⬇️'; // Cambia esto a los iconos que prefieras
            const iconColor = movement.type === 'income' ? 'green' : 'orange';

            row.innerHTML = `
                <td style="color: ${iconColor};">${icon}</td>
                <td>${movement.name}</td>
                <td>$${movement.value.toLocaleString()}</td>
                <td>$${movement.remaining.toLocaleString()}</td>
                <td>${movement.date}</td>
                <td>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </td>
            `;
            this.movementsTableBody.appendChild(row);
        });
    }

    setEditHandler(handler) {
        this.movementsTableBody.addEventListener('click', event => {
            if (event.target.classList.contains('edit-btn')) {
                const rowIndex = Array.from(this.movementsTableBody.children).indexOf(event.target.closest('tr'));
                handler(rowIndex);
            }
        });
    }

    setDeleteHandler(handler) {
        this.movementsTableBody.addEventListener('click', event => {
            if (event.target.classList.contains('delete-btn')) {
                const rowIndex = Array.from(this.movementsTableBody.children).indexOf(event.target.closest('tr'));
                handler(rowIndex);
            }
        });
    }
}

export default FinancialView;
