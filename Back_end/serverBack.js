require('dotenv').config();

const Sequelize = require('sequelize');
const express = require('express');
// const sqlite3 = require('sqlite3');
const app = express();

// connect to database
//const db = new sqlite3.Database('./Database/shopBatmintan.sqlite');

app.use(express.json());

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/shopBatmintan.sqlite',
})

const Products = sequelize.define('products', {
    product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    product_code:{
        type: Sequelize.STRING,
        allowNull: false
    },
    product_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    category_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    unit:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


const orders = sequelize.define('orders', {
    orders_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    products_id:{
        type: Sequelize.JSON,
        foreignKey: false
    },
    user_id:{
        type: Sequelize.STRING,
        foreignKey: false
    }
});

const categories = sequelize.define('categories', { 
    category_id: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Users = sequelize.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

sequelize.sync();

/////////// Products /////////////

//get all products
app.get('/products', async (req, res) => {
    try {
        const viewProducts = await Products.findAll();
        res.json(viewProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//create product
app.post('/products', async (req, res) => {
    try {
        const newProduct = await Products.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get product by id
app.get('/products/:id', async (req, res) => {
    try {
        const Product = await Products.findByPk(req.params.id);
        if (!Product) {
            res.status(404).json({ error: 'Can not get product' });
        } else {
            res.json(Product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//update/edit product
app.put('/products/:id', async (req, res) => {
    try {
        const updateProduct = await Products.findByPk(req.params.id);
        if (!updateProduct) {
            res.status(404).json({ error: 'Can not get product' });
        } else {
            await updateProduct.update(req.body);
            res.json(updateProduct);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.delete('/products/:id', async (req, res) => {
    try {
        const deleteProduct = await Products.findByPk(req.params.id);
        if (!deleteProduct) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            await deleteProduct.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/////////// Products /////////////

/////////// User /////////////

app.get('/users/', (req, res) => {

    Users.findAll()
        .then((users) => {

            res.json(users)

        })
        .catch((err) => {

            res.status(500).send(err)

        });
})

app.get('/users/:id', (req, res) => {

    Users.findByPk(req.params.id).then((user) => {

        if (!user) {

            res.status(404).send("User not found")

        } else {

            res.json(user)

        }
    }).catch((err) => {

        res.status(500).send(err)

    });
});

app.post('/users', (req, res) => {

    Users.create(req.body).then((user) => {

        res.send(user)

    }).catch((err) => {

        res.status(500).send(err)

    });
})

app.put('/users/:id', (req, res) => {

    Users.findByPk(req.params.id).then((user) => {

        if (!user) {

            res.status(404).send("User not found")

        } else {
            user.update(req.body).then(() => {

                res.send(user)

            }).catch((err) => {

                res.status(500).send(err)

            });
        }
    }).catch((err) => {

        res.status(500).send(err)

    });
});

app.delete('/users/:id', (req, res) => {

    Users.findByPk(req.params.id).then((user) => {

        if (!user) {

            res.status(404).send("User not found")

        } else {

            user.destroy().then(() => {

                res.send({})

            }).catch((err) => {

                res.status(500).send(err)

            });
        }
    }).catch((err) => {

        res.status(500).send(err)

    });
});

/////////// User /////////////

/////////// orders /////////////



app.post('/orders', async (req, res) => {
    try {
        const newOrder = await orders.create(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const allOrders = await orders.findAll();
        res.json(allOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/orders/:id', async (req, res) => {
    try {
        const order = await orders.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            res.json(order);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/orders/:id', async (req, res) => {
    try {
        const order = await orders.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            await order.update(req.body);
            res.json(order);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await orders.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            await order.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/////////// orders /////////////


/////////// categories /////////////

app.post('/categories', async (req, res) => {
    try {
        const newCategory = await categories.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const allCategories = await categories.findAll();
        res.json(allCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
        } else {
            res.json(category);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
        } else {
            await category.update(req.body);
            res.json(category);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
        } else {
            await category.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/////////// categories /////////////


app.listen(3000, () => { console.log(`Listening on port ${3000}`) })

