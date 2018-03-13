const express = require('express');
const axios = require('axios');
const http = require('http');

let nowInterval = null;

async function main()
{
    const app = express();
    const server = http.createServer(app);
    const io = require('socket.io')(server);

    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(express.static('public'));

    io.on('connection', async socket =>
    {
        let i = 1;
        socket.on('stop', (data) =>
        {
            clearInterval(nowInterval);
        });

        socket.on('currency', function (data)
        {
            console.log(data);
            if(data.time <= 1000)
            {
                data.time = 1000
            }
            nowInterval = setInterval(async () =>
            {
                socket.emit('lol', i++);
                socket.emit('btc', (await axios.get('https://blockchain.info/en/ticker')).data[data.curr])
            }, data.time)
        });
        //setInterval(() => socket.emit('lol', i++), 1000);
    });

    server.listen(3010, ()=>
    {
        console.log('Example app listening on port 3010!');
    });
}

main();