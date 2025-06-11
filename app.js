// app.js

const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const messageDiv = document.querySelector('#message');
const searchForm = document.querySelector('#search-product-form');
const searchInput = document.querySelector('#search-id');

function showMessage(msg, type = 'success') {
    messageDiv.innerText = msg;
    messageDiv.style.color = type === 'success' ? 'green' : 'red';
    setTimeout(() => messageDiv.innerText = '', 3000);
}

async function fetchProducts() {
    const response = await fetch('http://52.87.187.128:3000/products');
    const products = await response.json();
    renderProductList(products);
}

function renderProductList(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>#${product.id}</strong> - ${product.name} - R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}<br>${product.description}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Excluir';
        deleteButton.addEventListener('click', async () => {
            await deleteProduct(product.id);
            showMessage('Produto excluído com sucesso!');
            await fetchProducts();
        });
        li.appendChild(deleteButton);

        const updateButton = document.createElement('button');
        updateButton.innerHTML = 'Editar';
        updateButton.addEventListener('click', () => {
            updateProductId.value = product.id;
            updateProductName.value = product.name;
            updateProductPrice.value = product.price;
        });
        li.appendChild(updateButton);

        productList.appendChild(li);
    });
}

addProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = addProductForm.elements['name'].value;
    const description = addProductForm.elements['description'].value;
    const price = addProductForm.elements['price'].value;

    if (!name || !price) {
        showMessage('Preencha todos os campos obrigatórios!', 'error');
        return;
    }

    await addProduct(name, description, price);
    addProductForm.reset();
    showMessage('Produto adicionado com sucesso!');
    await fetchProducts();
});

updateProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = updateProductId.value;
    const name = updateProductName.value;
    const price = updateProductPrice.value;

    if (!name || !price) {
        showMessage('Preencha todos os campos para atualizar!', 'error');
        return;
    }

    await updateProduct(id, name, price);
    updateProductForm.reset();
    showMessage('Produto atualizado com sucesso!');
    await fetchProducts();
});

searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = searchInput.value;
    if (!id) return;

    try {
        const response = await fetch(`http://52.87.187.128:3000/products/${id}`);
        if (!response.ok) throw new Error('Erro na resposta');

        const data = await response.json();

        // Verifica se é um array e extrai o primeiro item
        const product = Array.isArray(data) ? data[0] : data;

        if (!product || !product.id) {
            throw new Error('Produto inválido');
        }

        renderProductList([product]);
        showMessage('Produto encontrado com sucesso!');
    } catch (err) {
        productList.innerHTML = '';
        showMessage('Produto não encontrado!', 'error');
    }
});




async function addProduct(name, description, price) {
    const response = await fetch('http://52.87.187.128:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price })
    });
    return response.json();
}

async function updateProduct(id, name, price) {
    const response = await fetch(`http://52.87.187.128:3000/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    });
    return response.json();
}

async function deleteProduct(id) {
    const response = await fetch(`http://52.87.187.128:3000/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
}

fetchProducts();
