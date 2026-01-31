document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8000';
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No autorizado. Por favor, inicie sesión.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    const inventoryTableBody = document.querySelector('#inventoryTable tbody');
    const createItemBtn = document.getElementById('createItemBtn');

    // Create Item Modal elements
    const createItemModal = document.getElementById('createItemModal');
    const createItemForm = document.getElementById('createItemForm');
    const createNombre = document.getElementById('createNombre');
    const createDescripcion = document.getElementById('createDescripcion');
    const createPrecio = document.getElementById('createPrecio');
    const createCant = document.getElementById('createCant');
    const createFoto = document.getElementById('createFoto');
    const createModalClose = createItemModal.querySelector('.close-button');

    // Edit Item Modal elements
    const editItemModal = document.getElementById('editItemModal');
    const editItemForm = document.getElementById('editItemForm');
    const editItemId = document.getElementById('editItemId');
    const editNombre = document.getElementById('editNombre');
    const editDescripcion = document.getElementById('editDescripcion');
    const editPrecio = document.getElementById('editPrecio');
    const editCant = document.getElementById('editCant');
    const editFoto = document.getElementById('editFoto');
    const currentFoto = document.getElementById('currentFoto');
    const editModalClose = editItemModal.querySelector('.close-button');

    // Helper to get auth headers
    const getAuthHeaders = () => {
        return {
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
        };
    };

    // Helper to show/hide modals
    const showModal = (modalElement) => {
        modalElement.style.display = 'block';
    };

    const hideModal = (modalElement) => {
        modalElement.style.display = 'none';
    };

    // Helper to clear form
    const clearForm = (formElement) => {
        formElement.reset();
        if (formElement === editItemForm) {
            currentFoto.style.display = 'none';
            currentFoto.src = '';
        }
    };

    // Fetch all inventory items
    const fetchItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/items`, getAuthHeaders());
            const items = response.data;
            inventoryTableBody.innerHTML = ''; // Clear existing rows

            items.forEach(item => {
                const row = inventoryTableBody.insertRow();
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td><img src="${API_URL}/uploads/${item.foto}" alt="${item.nombre}" width="50"></td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>$${item.precio.toFixed(2)}</td>
                    <td>${item.cant}</td>
                    <td class="actions-buttons">
                        <button class="btn-info edit-btn" data-id="${item.id}">Editar</button>
                        <button class="btn-danger delete-btn" data-id="${item.id}">Eliminar</button>
                    </td>
                `;
            });

            // Attach event listeners to new buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => editItem(e.target.dataset.id));
            });
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => deleteItem(e.target.dataset.id));
            });

        } catch (error) {
            console.error('Error fetching items:', error);
            alert('Error al cargar el inventario.');
        }
    };

    // Create new item
    createItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', createNombre.value);
        formData.append('descripcion', createDescripcion.value);
        formData.append('precio', createPrecio.value);
        formData.append('cant', createCant.value);
        if (createFoto.files[0]) {
            formData.append('foto', createFoto.files[0]);
        }

        try {
            await axios.post(`${API_URL}/items`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': token,
                },
            });
            alert('Item creado exitosamente!');
            hideModal(createItemModal);
            clearForm(createItemForm);
            fetchItems();
        } catch (error) {
            console.error('Error creating item:', error);
            alert('Error al crear el item.');
        }
    });

    // Populate edit modal and show
    const editItem = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/items/${id}`, getAuthHeaders());
            const item = response.data;

            editItemId.value = item.id;
            editNombre.value = item.nombre;
            editDescripcion.value = item.descripcion;
            editPrecio.value = item.precio;
            editCant.value = item.cant;

            if (item.foto) {
                currentFoto.src = `${API_URL}/uploads/${item.foto}`;
                currentFoto.style.display = 'block';
            } else {
                currentFoto.style.display = 'none';
                currentFoto.src = '';
            }

            showModal(editItemModal);
        } catch (error) {
            console.error('Error fetching item for edit:', error);
            alert('Error al cargar los datos del item para editar.');
        }
    };

    // Update item
    editItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = editItemId.value;
        const formData = new FormData();
        formData.append('nombre', editNombre.value);
        formData.append('descripcion', editDescripcion.value);
        formData.append('precio', editPrecio.value);
        formData.append('cant', editCant.value);
        // Only append photo if a new one is selected
        if (editFoto.files[0]) {
            formData.append('foto', editFoto.files[0]);
        }

        try {
            await axios.put(`${API_URL}/items/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                    'authorization': token,
                },
            });
            alert('Item actualizado exitosamente!');
            hideModal(editItemModal);
            clearForm(editItemForm);
            fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error al actualizar el item.');
        }
    });

    // Delete item
    const deleteItem = async (id) => {
        if (confirm('¿Está seguro de que desea eliminar este item?')) {
            try {
                await axios.delete(`${API_URL}/items/${id}`, getAuthHeaders());
                alert('Item eliminado exitosamente!');
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Error al eliminar el item.');
            }
        }
    };

    // Event Listeners for Modals
    createItemBtn.addEventListener('click', () => showModal(createItemModal));
    createModalClose.addEventListener('click', () => {
        hideModal(createItemModal);
        clearForm(createItemForm);
    });
    editModalClose.addEventListener('click', () => {
        hideModal(editItemModal);
        clearForm(editItemForm);
    });

    window.addEventListener('click', (event) => {
        if (event.target == createItemModal) {
            hideModal(createItemModal);
            clearForm(createItemForm);
        }
        if (event.target == editItemModal) {
            hideModal(editItemModal);
            clearForm(editItemForm);
        }
    });

    // Initial fetch of items
    fetchItems();
});
