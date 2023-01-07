const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const port = process.env.PORT || 1000;
let app = express();
let server = http.createServer(app);
let io = new Server(server);

app.use(express.static("material"));

app.get('/', (q, r) => {
    r.sendFile(__dirname + "/home/index.html");
})

app.get('/jquery', (q, r) => {
    r.sendFile(__dirname + "/node_modules/jquery/dist/jquery.min.js")
})

app.get('/peer1', (q, r) => {
    r.sendFile(__dirname + "/home/peer1.html")
})

app.get('/peer2', (q, r) => {
    r.sendFile(__dirname + "/home/peer2.html")
})

app.get('/socket.io', (q, r) => {
    r.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.min.js")
})
var count_user = 0;

io.on("connect", (o) => {

    count_user = count_user + 1;

    o.on("disconnect", () => {
        count_user = count_user - 1;
        console.log("disconnected", count_user, o.id);
        o.emit("conn", count_user)
        o.broadcast.emit("conn", count_user)
    })

    o.emit("conn", count_user)
    o.broadcast.emit("conn", count_user)

    console.log("connected", count_user, o.id)

    o.on("p1off", (p1off) => {
        console.log(p1off)
        o.broadcast.emit("p1offer", p1off)
    })

    o.on("p2ans", (p2ans) => {
        console.log(p2ans)
        o.broadcast.emit("p2answer", p2ans)
    })

    o.on("reload", () => {
        o.broadcast.emit("reload", {})
    })

})

server.listen(port, () => {
    console.log('listning on port ' + port);
})