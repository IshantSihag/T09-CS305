const express = require('express');
const cors = require('cors');

const auth = require("./routes/auth")
const roles = require("./routes/roles")
const user = require('./routes/user');

require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors());

app.get('/home', (req, res)=>{
    return res.send('Testing')
})

app.use('/api/auth', auth)
app.use('/api/roles', roles)
app.use('/api/user', user);
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})