'use strict';

const http = require('http');

http.createServer((req, res) => {
    if (req.method === 'GET'){
        console.log('work');
        res.end('ho');
    } else {
        let body = "";
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            console.log(body);
            res.end('ok');
        });
    }
}).listen(3001);