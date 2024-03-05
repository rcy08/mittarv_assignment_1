require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');

const authRoutes = require('./routes/authRoutes'); 

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(compression());
app.use(cors());

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to db and listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error connecting to DB: ${err}`);
    })

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        '*'
    );
    res.header(
        "Access-Control-Allow-Origin",
        "Origin,X-Requested-With,Content-Type,Accept",
        "Access-Control-Allow-Methods: GET, DELETE, PUT, PATCH, HEAD, OPTIONS, POST"
    );
    next();
});

app.get('/', (req, res) => {
    const url = process.env.CLIENT_DOMAIN;
    res.send(`<a href=${url}>${url}</a>`);
});

app.use('/auth', authRoutes);
