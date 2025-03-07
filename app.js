let div = document.querySelector('#div');
const phones = [
    {
        brand: 'Samsung',
        model: 'S20',
        ram: 8,
        rom: 256,
        camera: '20 megapixel',
        price: 1100,
    },
    {
        brand: 'Xiomi',
        model: 'note10',
        ram: 4,
        rom: 64,
        camera: '10 megapixel',
        price: 1300
    },
    {
        brand: 'Infinix',
        model: 'z10',
        ram: 2,
        rom: 16,
        camera: '5 megapixel',
        price: 1500
    },
    {
        brand: 'Tecno',
        model: 'spark10',
        ram: 12,
        rom: 512,
        camera: '25 megapixel',
        price: 1100
    },
    {
        brand: 'Iphone',
        model: '14',
        ram: 4,
        rom: 1024,
        camera: '30 megapixel',
        price: 1540
    },
    {
        brand: 'Oppo',
        model: 'F11',
        ram: 8,
        rom: 256,
        camera: '20 megapixel',
        price: 1450
    },
    {
        brand: 'Vivo',
        model: 'y20',
        ram: 4,
        rom: 64,
        camera: '8 megapixel',
        price: 1300
    },
    {
        brand: 'Samsung',
        model: 's50',
        ram: 50,
        rom: 1024,
        camera: '60 megapixel',
        price: 1250,
    },
];
let arr = [];
let cartCount = 0;

function render() {
    let content = '';
    for (let i = 0; i < phones.length; i++) {
        if (i % 2 === 0) {
            content += '<div class="row justify-content-center">';
        }

        content += `
    <div class="col-md-5 mb-4 d-flex align-items-stretch">
        <div class="card mt-4 rounded-sm bg-dark text-white border border-white w-100">
            <div class="card-body d-flex flex-column">
                <h3 class="card-title">Brand : ${phones[i].brand}</h3>
                <h5 class="card-text">Model : ${phones[i].model}</h5>
                <h5 class="card-text">Ram : ${phones[i].ram}</h5>
                <h5 class="card-text">Rom : ${phones[i].rom}</h5>
                <h5 class="card-text">Camera : ${phones[i].camera}</h5>
                <h5 class="card-text">Price : ${phones[i].price}</h5>
                <div class="mt-auto">
                    <button onclick="addTocart(${i})" class="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
    </div>`;

        if (i % 2 === 1 || i === phones.length - 1) {
            content += '</div>';
        }
    }
    div.innerHTML = content;
}

function addTocart(index) {
    if (arr.includes(phones[index])) {
        phones[index].quantity += 1;
    } else {
        phones[index].quantity = 1;
        arr.push(phones[index]);
    }
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
    console.log(arr);

    dataLayer.push({
        'event': 'add_to_cart',
        'currency': 'EUR',  // Moneda en formato ISO 4217
        'value': phones[index].price * phones[index].quantity,  // Valor total del evento
        'ecommerce': {
            'items': [{
                'item_id': phones[index].model,
                'item_name': `${phones[index].brand} ${phones[index].model}`,
                'price': phones[index].price,
                'quantity': phones[index].quantity,
                'item_brand': phones[index].brand,  // Se agrega la marca
                'item_category': 'Electronics'  // Se define una categoría base
            }]
        }
    });
}

function checkCart() {
    if (arr.length === 0) {
        console.warn("No hay productos en el carrito para hacer checkout.");
        return;
    }

    // Enviar evento begin_checkout a dataLayer con la estructura de ecommerce
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'begin_checkout',
        'ecommerce': {  // 🔥 Se agregó "ecommerce" para que GA4 lo reconozca correctamente
            'currency': 'EUR',
            'value': arr.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            'items': arr.map((item, index) => ({
                'item_id': item.model,
                'item_name': `${item.brand} ${item.model}`,
                'item_brand': item.brand,
                'item_category': 'Electronics',
                'price': item.price,
                'quantity': item.quantity,
                'index': index
            }))
        }
    });

    console.log("Evento begin_checkout enviado a GA4:", window.dataLayer);

    // Mantiene el flujo original
    localStorage.setItem('CartItem', JSON.stringify(arr));
    window.location = 'cart.html';
}

window.addTocart = addTocart;
window.checkCart = checkCart;

render();