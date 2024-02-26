const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Import path module

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Use path module here

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.error('Error de conexión:', err));

const User = require('./user');

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });

    user.save((err) => {
        if (err) {
            if (err.code === 11000) {
                // Duplicate username error
                return res.status(400).send('Username already exists');
            }
            return res.status(500).send('Error registering user');
        }
        res.status(200).send('User registered successfully');
    });
});

app.get('/inicio', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('¡Bienvenido!');
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    res.json({ response: 'Página OK' });
});

app.listen(9001, () => {
    console.log('Servidor OK');
});

module.exports = app;