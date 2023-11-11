const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}...`)
})

app.get('/', (req, res) => {
    res.send('HOME')
})

app.get('*', (req, res) => {
    res.status(404).json({ code: 404 });
});