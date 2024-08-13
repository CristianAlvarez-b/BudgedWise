class FinancialView {
    constructor() {
        this.amountElement = document.querySelector('.btn-amount'); // Cambia esto según el selector correcto
        this.movementsTableBody = document.querySelector('.movements-table tbody');
    }

    updateBalance(balance) {
        this.amountElement.textContent = `$${balance.toLocaleString()} COP`;
    }

    updateMovements(movements) {
        this.movementsTableBody.innerHTML = '';

        movements.forEach(movement => {
            const row = document.createElement('tr');
            const icon = movement.type === 'income' ? '⬆️' : '⬇️'; // Iconos para income y outcome
            const iconColor = movement.type === 'income' ? 'green' : 'orange';

            row.innerHTML = `
                <td style="color: ${iconColor}; font-size: 20px;">${icon}</td> <!-- Icono con color y tamaño -->
                <td>${movement.name}</td>
                <td>$${movement.value.toLocaleString()}</td>
                <td>$${movement.remaining.toLocaleString()}</td>
                <td>${movement.date}</td>
                <td>
                    <button class="edit-btn" style="background: none; border: none; cursor: pointer;">✏️</button> <!-- Botón Editar -->
                    <button class="delete-btn" style="background: none; border: none; cursor: pointer;">🗑️</button> <!-- Botón Eliminar -->
                </td>
            `;
            this.movementsTableBody.appendChild(row);
        });
    }

    setEditHandler(handler) {
        this.movementsTableBody.addEventListener('click', event => {
            if (event.target.closest('.edit-btn')) {
                const rowIndex = Array.from(this.movementsTableBody.children).indexOf(event.target.closest('tr'));
                handler(rowIndex);
            }
        });
    }

    setDeleteHandler(handler) {
        this.movementsTableBody.addEventListener('click', event => {
            if (event.target.closest('.delete-btn')) {
                const rowIndex = Array.from(this.movementsTableBody.children).indexOf(event.target.closest('tr'));
                handler(rowIndex);
            }
        });
    }
}

export default FinancialView;
