// Module dependencies
const express = require('express');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const mysql = require('mysql');

const app = express();

const conn = mysql.createConnection({
    // DB connecting here
    host: "localhost",
    user: "root",
    database: "products",
    password: "root"
});

conn.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});


// Set port of app
const port = 20202;
app.listen(port, function () {
    console.log('Listening on :' + port);
});

// Set static folder
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


/**
 * GET all products
 */
app.get('/product', getProducts);

function getProducts(req, res) {
    // If any
    let query = `SELECT * FROM productslist`;
    conn.query(query, (err, result, field) => {
        console.log(err);
        res.send(result);
    });
}

/**
 * GET add new product
 */
app.post('/product/add/:name/:price', addProduct);

function addProduct(req, res) {
    var data = req.params;
    var name = data.name;
    var price = Number(data.price);
    // If name and price are valid add new product
    if (name && price) {
        let id = Math.floor(Math.random() * 1000);
        let query = `INSERT INTO productslist (id, name, price)
        VALUES (${id}, "${name}", ${price});`;
        conn.query(query, (err, result, field) => {
            console.log(err);
        });
        res.send({
            response: "Success!"
        });
    } else {
        res.send({
            response: "Something went wrong"
        });
    }
}


/**
 * GET delete product by id
 */
app.delete('/product/destroy/:id', removeProduct);

function removeProduct(req, res) {
    var data = req.params;
    var id = Number(data.id);
    // If id is valid
    let query = `DELETE FROM productslist WHERE id=${id};`;
    conn.query(query, (err, result, field) => {
        console.log(err);
    });
    res.send({
        response: "Success!"
    });

}

/**
 * GET search of products
 */
app.get('/product/search/:q', searchForProduct);

function searchForProduct(req, res) {
    var data = req.params;
    var q = data.q;
    let query = `SELECT * FROM productslist WHERE name="${q}"`;
    conn.query(query, (err, result, field) => {
        console.log(err);
        res.send(result);
    });
}

/**
 * GET cart
 */
app.get('/cart', function (req, res) {
    // Send HTML page of cart
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});
