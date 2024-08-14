class FinancialView {
    constructor() {
        this.amountElement = document.querySelector('.btn-amount');
        this.movementsTableBody = document.querySelector('.movements-table tbody');
    }

    updateBalance(balance) {
        this.amountElement.textContent = `$${balance.toLocaleString()} COP`;
    }

    updateMovements(movements) {
        this.movementsTableBody.innerHTML = '';

        movements.forEach(movement => {
            const row = document.createElement('tr');
            const iconSrc = movement.type === 'income' ? 'Imagenes/arriba.png' : 'Imagenes/abajo.png'; // Ruta de las imágenes
            const iconAlt = movement.type === 'income' ? 'Ingreso' : 'Egreso';

            row.innerHTML = `
                <td class="icon-cell">
                    <img src="${iconSrc}" alt="${iconAlt}" class="icon-img">
                </td>
                <td>${movement.name}</td>
                <td>$${movement.value.toLocaleString()}</td>
                <td>$${movement.remaining.toLocaleString()}</td>
                <td>${movement.date}</td>
                <td class="action-cell">
                    <button class="edit-btn action-btn">
                        <img src="Imagenes/editar.png" alt="Editar" class="action-img">
                    </button>
                    <button class="delete-btn action-btn">
                        <img src="Imagenes/eliminar.png" alt="Eliminar" class="action-img">
                    </button>
                </td>
            `;
            this.movementsTableBody.prepend(row); // Insertar al principio para que aparezca primero
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
