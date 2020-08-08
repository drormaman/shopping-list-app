const express = require('express');
const app = express();
const faker = require('faker');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


let products = [];
for (let i = 1; i < 16; i++) {
    const newProduct = {
        id: `${i}`,
        productName: faker.commerce.productName(),
        price: faker.commerce.price()
    };
    products.push(newProduct);
}
let currentId = products.length + 1;

// CREATE
app.post('/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = `${currentId++}`;
    products.push(newProduct);
    res.send(newProduct);
});

// READ
app.get('/products', (req, res) => {
    res.send(products);
});

app.get('/products/:id', (req, res) => {
    for (const product of products) {
        if (product.id === req.params.id) {
            res.send(product);
        }
    }
});

// UPDATE
app.put('/products/:id', (req, res) => {
    const paramId = req.params.id;
    products.forEach((product, i, products) => {
        if (product.id === paramId) {
            products[i] = req.body;
            products[i].id = paramId;
            res.send(products[i]);
        }
    });
    res.send(`This product id doesn't exist`)
});

// DELETE
app.delete('/products/:id', (req, res) => {
    const paramId = req.params.id;
    products.forEach((product, i, products) => {
        if (product.id === paramId) {
            const deletedName = product.productName;
        }
    });
    products = products.filter(product => product.id !== paramId);
    res.send(`${deletedName} was deleted`);
});

app.listen(3000);