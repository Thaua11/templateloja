// Banco de dados simulado
let products = [
    {
        id: 1,
        name: "Camiseta Básica",
        price: 49.90,
        description: "Camiseta 100% algodão, disponível em várias cores.",
        image: "img/produto1.jpg",
        colors: ["Branco", "Preto", "Azul", "Vermelho"],
        sizes: ["P", "M", "G", "GG"]
    },
    {
        id: 2,
        name: "Calça Jeans",
        price: 129.90,
        description: "Calça jeans masculina, modelo slim fit.",
        image: "img/produto2.jpg",
        colors: ["Azul Claro", "Azul Escuro", "Preto"],
        sizes: ["38", "40", "42", "44", "46"]
    }
];

// Carrinho de compras
let cart = [];

// Carrega os produtos na página
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="openProductModal(${product.id})">Comprar</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Modal de produto
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto; margin: 1rem 0;">
            <p><strong>Preço:</strong> R$ ${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            
            <form id="product-form">
                ${product.colors ? `
                <div class="form-group">
                    <label for="color">Cor:</label>
                    <select id="color" name="color" required>
                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
                
                ${product.sizes ? `
                <div class="form-group">
                    <label for="size">Tamanho:</label>
                    <select id="size" name="size" required>
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
                
                <div class="form-group">
                    <label for="quantity">Quantidade:</label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" required>
                </div>
                
                <button type="button" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Adiciona ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const form = document.getElementById('product-form');
    const color = form.color ? form.color.value : null;
    const size = form.size ? form.size.value : null;
    const quantity = parseInt(form.quantity.value);
    
    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        color,
        size,
        quantity,
        image: product.image
    };
    
    cart.push(cartItem);
    updateCartCount();
    closeModal();
    
    // Mostra feedback
    alert(`${product.name} adicionado ao carrinho!`);
}

// Atualiza contador do carrinho
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Finalizar pedido via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let message = "Olá, gostaria de fazer um pedido:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        message += `- ${item.name}`;
        if (item.color) message += ` (Cor: ${item.color})`;
        if (item.size) message += ` (Tamanho: ${item.size})`;
        message += ` - ${item.quantity}x R$ ${item.price.toFixed(2)}\n`;
        total += item.price * item.quantity;
    });
    
    message += `\nTotal: R$ ${total.toFixed(2)}`;
    
    // Número de telefone da loja (substitua pelo número real)
    const phoneNumber = "+55 (49) 99821-1837";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Limpa o carrinho
    cart = [];
    updateCartCount();
    
    // Abre o WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Carrega os produtos quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Adiciona evento ao ícone do carrinho
    document.querySelector('.cart-icon').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'cart-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal()">&times;</span>
                <h2>Seu Carrinho</h2>
                <div id="cart-items" style="margin: 1rem 0;"></div>
                <button onclick="checkout()" style="background-color: #25D366; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold;">
                    Finalizar Pedido via WhatsApp
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        const cartItems = document.getElementById('cart-items');
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.style.display = 'flex';
            itemElement.style.justifyContent = 'space-between';
            itemElement.style.marginBottom = '0.5rem';
            itemElement.style.alignItems = 'center';
            
            itemElement.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem;">
                    <div>
                        <p style="font-weight: bold;">${item.name}</p>
                        <small>${item.color ? `Cor: ${item.color}, ` : ''}${item.size ? `Tam: ${item.size}, ` : ''}Qtd: ${item.quantity}</small>
                    </div>
                </div>
                <p>R$ ${itemTotal.toFixed(2)}</p>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        const totalElement = document.createElement('div');
        totalElement.style.display = 'flex';
        totalElement.style.justifyContent = 'space-between';
        totalElement.style.marginTop = '1rem';
        totalElement.style.paddingTop = '1rem';
        totalElement.style.borderTop = '1px solid #ddd';
        totalElement.style.fontWeight = 'bold';
        totalElement.innerHTML = `<p>Total:</p><p>R$ ${total.toFixed(2)}</p>`;
        
        cartItems.appendChild(totalElement);
    });
});