// Carrega os produtos na tabela admin
function loadAdminProducts() {
    const productList = document.getElementById('admin-product-list');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-image-table"></td>
            <td>${product.name}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Abre modal para adicionar produto
function openAddProductModal() {
    document.getElementById('modal-title').textContent = 'Adicionar Novo Produto';
    document.getElementById('product-id').value = '';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').style.display = 'block';
}

// Editar produto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modal-title').textContent = 'Editar Produto';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-colors').value = product.colors ? product.colors.join(',') : '';
    document.getElementById('product-sizes').value = product.sizes ? product.sizes.join(',') : '';
    document.getElementById('product-image').value = product.image;
    
    document.getElementById('product-modal').style.display = 'block';
}

// Salvar produto (adicionar ou editar)
function saveProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const colors = document.getElementById('product-colors').value.split(',').map(c => c.trim()).filter(c => c);
    const sizes = document.getElementById('product-sizes').value.split(',').map(s => s.trim()).filter(s => s);
    const image = document.getElementById('product-image').value;
    
    if (!name || isNaN(price) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    if (id) {
        // Editar produto existente
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = {
                id: parseInt(id),
                name,
                price,
                description,
                colors: colors.length ? colors : null,
                sizes: sizes.length ? sizes : null,
                image
            };
        }
    } else {
        // Adicionar novo produto
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            price,
            description,
            colors: colors.length ? colors : null,
            sizes: sizes.length ? sizes : null,
            image
        });
    }

    // Salva no localStorage (simulando banco de dados)
    localStorage.setItem('products', JSON.stringify(products));
    
    // Recarrega a lista
    loadAdminProducts();
    closeModal();
}

// Excluir produto
function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminProducts();
    }
}

// Fecha o modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Carrega os produtos do localStorage se existirem
document.addEventListener('DOMContentLoaded', () => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    loadAdminProducts();
    
    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('product-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});