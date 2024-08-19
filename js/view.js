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
            
            // Definir los íconos según el tipo de movimiento
            let iconSrc, iconAlt;
            switch (movement.type) {
                case 'income':
                    iconSrc = 'Imagenes/arriba.png'; // Icono para ingresos
                    iconAlt = 'Ingreso';
                    break;
                case 'expense':
                    iconSrc = 'Imagenes/abajo.png'; // Icono para egresos
                    iconAlt = 'Egreso';
                    break;
                case 'pocketIncome':
                    iconSrc = 'Imagenes/pocketIncome.png'; // Icono para ingresos en bolsillo
                    iconAlt = 'Ingreso en Bolsillo';
                    break;
                case 'pocketOutcome':
                    iconSrc = 'Imagenes/pocketOutcome.png'; // Icono para egresos en bolsillo
                    iconAlt = 'Egreso en Bolsillo';
                    break;
                default:
                    iconSrc = 'Imagenes/default.png'; // Icono por defecto en caso de un tipo desconocido
                    iconAlt = 'Tipo Desconocido';
            }
        
            // Tomar solo la parte de la fecha, sin la hora
            const dateOnly = movement.date.split(' ')[0];
        
            row.innerHTML = `
                <td class="icon-cell">
                    <img src="${iconSrc}" alt="${iconAlt}" class="icon-img">
                </td>
                <td>${movement.name}</td>
                <td>$${movement.value.toLocaleString()}</td>
                <td>$${movement.remaining.toLocaleString()}</td>
                <td>${dateOnly}</td>
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
                // Calcular el índice real en el modelo
                const realIndex = this.movementsTableBody.children.length - rowIndex - 1;
                handler(realIndex);
            }
        });
    }
    
    setDeleteHandler(handler) {
        this.movementsTableBody.addEventListener('click', event => {
            if (event.target.closest('.delete-btn')) {
                const rowIndex = Array.from(this.movementsTableBody.children).indexOf(event.target.closest('tr'));
                const realIndex = this.movementsTableBody.children.length - rowIndex - 1;
    
                // Mostrar alerta de confirmación
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        handler(realIndex);
                        Swal.fire(
                            'Deleted!',
                            'Your movement has been deleted.',
                            'success'
                        );
                    }
                });
            }
        });
    }
    
    
}

export default FinancialView;