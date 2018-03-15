const express = require('express');
const axios = require('axios');
const http = require('http');

async function main()
{
    const app = express();
    const server = http.createServer(app);
    const io = require('socket.io')(server);

    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(express.static('public'));

    io.sockets.on('connection', async socket =>
    {
        let i = 1;
        let currency = "USD";
        let nowInterval = null;
        let time = 10000000;
        let mySock = socket;
        console.log(socket.id);
        socket.on('stop', (data) =>
        {
            clearInterval(nowInterval);
        });

        socket.on('currency', async function(data)
        {
            console.log(data);
            data.time < 1000 ? data.time = 1000 : null;

            currency = data.curr;
            time = data.time;

            nowInterval = setInterval(async () =>
            {
                socket.emit('btc', (await axios.get('https://blockchain.info/en/ticker')).data[currency])
            }
                , time);
        });

        socket.on('getBuy', async (msg) =>
        {
            io.emit('buy', msg);
        });

        socket.on('getSell', async (msg) =>
        {
            io.emit('sell', msg);
        });
    });

    server.listen(3010, ()=>
    {
        console.log('Example app listening on port 3010!');
    });
}
main();