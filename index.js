require('dotenv').config();

const express = require('express');
var app = express();

app.locals.SITE_URL = process.env.SITE_URL;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('index');
})



const server = app.listen(process.env.PORT || 3000);


const io = require('socket.io')(server);



io.on('connection', (socket) => { 

    io.sockets.emit('online', Object.keys(io.sockets.json.sockets).length)

    socket.on('message', (data) => {
        io.sockets.emit('message', data);

        io.sockets.emit('online', Object.keys(io.sockets.json.sockets).length)

    })

    socket.on('typing', (data) => {
        io.sockets.emit('typing', true);

        io.sockets.emit('online', Object.keys(io.sockets.json.sockets).length)
        
    })

});



