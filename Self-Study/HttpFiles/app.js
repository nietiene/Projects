const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        fs.readFile('./public/home.html', (err, data) => {
            if (err) {
                console.log("internal Server error", err);
            } else {
               res.end(data);
            }
        });
    }

    if (req.url === '/about') {
        fs.readFile("./public/about.html", (err ,data) => {
            if (err) {
                console.log ("internal server error");
            } else {
                res.end(data);
            }
        })
    }
})
server.listen(3000, () => console.log('http://localhost:3000'))