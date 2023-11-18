const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
require('dotenv').config();

var connection = require('./db/index');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', require('./routers/user'))
app.use('/api/post', require('./routers/post'))
// app.use('/api/engagement', routers.engagementRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}...`)

    // if (connection.state === 'disconnected') {
    //     return respond(null, { status: 'fail', message: 'server down' });
    // }
})

app.get('/', (req, res) => {
    res.send('HOME')
})

app.get('*', (req, res) => {
    res.status(404).json({ code: 404 });
});