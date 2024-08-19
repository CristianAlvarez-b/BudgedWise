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
            let iconSrc, iconAlt, editIcon, deleteIcon;
            switch (movement.type) {
                case 'income':
                    iconSrc = 'Imagenes/arriba.png'; // Icono para ingresos
                    iconAlt = 'Ingreso';
                    editIcon = 'Imagenes/editar.png';
                    deleteIcon = 'Imagenes/eliminar.png';
                    break;
                case 'expense':
                    iconSrc = 'Imagenes/abajo.png'; // Icono para egresos
                    iconAlt = 'Egreso';
                    editIcon = 'Imagenes/editar.png';
                    deleteIcon = 'Imagenes/eliminar.png';
                    break;
                case 'pocketIncome':
                    iconSrc = 'Imagenes/pocketIncome.png'; // Icono para ingresos en bolsillo
                    iconAlt = 'Ingreso en Bolsillo';
                    editIcon = 'Imagenes/editPocket.png';
                    deleteIcon = 'Imagenes/deletePocket.png';
                    break;
                case 'pocketOutcome':
                    iconSrc = 'Imagenes/pocketOutcome.png'; // Icono para egresos en bolsillo
                    iconAlt = 'Egreso en Bolsillo';
                    editIcon = 'Imagenes/editPocket.png';
                    deleteIcon = 'Imagenes/deletePocket.png';
                    break;
                default:
                    iconSrc = 'Imagenes/default.png'; 
                    iconAlt = 'Tipo Desconocido';
                    editIcon = 'Imagenes/default.png';
                    deleteIcon = 'Imagenes/default.png';
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
                        <img src="${editIcon}" alt="Editar" class="action-img">
                    </button>
                    <button class="delete-btn action-btn">
                        <img src="${deleteIcon}" alt="Eliminar" class="action-img">
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
                const realIndex = this.movementsTableBody.children.length - rowIndex - 1;
                const movementRow = this.movementsTableBody.children[rowIndex];
                const iconImg = movementRow.querySelector('.icon-img');
                const iconAlt = iconImg.alt;
    
                if (iconAlt === 'Ingreso en Bolsillo' || iconAlt === 'Egreso en Bolsillo') {
                    Swal.fire({
                        title: "Can't edit movement",
                        text: "You can't edit a movement from a pocket",
                        icon: 'error',
                        confirmButtonColor: '#eba646',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    handler(realIndex);
                }
            }
        });
    }
    

    setDeleteHandler(handler) {
        this.movementsTableBody.addEventListener('click', event => {
            if (event.target.closest('.delete-btn')) {
                const rowIndex = Array.from(this.movementsTableBody.children).indexOf(event.target.closest('tr'));
                const realIndex = this.movementsTableBody.children.length - rowIndex - 1;
                const movementRow = this.movementsTableBody.children[rowIndex];
                const iconImg = movementRow.querySelector('.icon-img');
                const iconAlt = iconImg.alt;
    
                if (iconAlt === 'Ingreso en Bolsillo' || iconAlt === 'Egreso en Bolsillo') {
                    Swal.fire({
                        title: "Can't delete movement",
                        text: "You can't delete a movement from a pocket",
                        icon: 'error',
                        confirmButtonColor: '#eba646',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    // Mostrar alerta de confirmación
                    Swal.fire({
                        title: '¿Are you sure?',
                        text: "¡You won't be able to reverse this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#5296be',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete!',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            handler(realIndex);
                            Swal.fire(
                                '¡Deleted!',
                                'Movement deleted.',
                                'success'
                            );
                        }
                    });
                }
            }
        });
    }
    
    
}

export default FinancialView;