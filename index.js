const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const port = process.env.PORT || 1000;
let app = express();
let server = http.createServer(app);
let io = new Server(server);

app.use(express.static("material"));

app.get('/', (q, r) => {
    r.send("<h1>Welcome to this WebRTC Chatting Web Application</h1><a href='/peer1/?auth=' target='/peer1/?auth='><button>PEER1</button></a><br><br><a href='/peer2/?auth=' target='/peer2/?auth='><button>PEER2</button></a><br><br><center><summery>About : This site is Created by <b>Akshansh Chauhan</b></summery></center>");
})

app.get('/peer1/', (q, r) => {
    if (q.query.auth == "call2") {
        r.sendFile(__dirname + "/home/peer1.html")
    } else {
        r.send(`Your are not Authorize Peer 1 <br>Enter S.Code Here : <input type='password' placeholder='enter s...code' onchange="window.location.href = '?auth=' + this.value;">`)
    }
})

app.get('/peer2/', (q, r) => {
    if (q.query.auth == "call1") {
        r.sendFile(__dirname + "/home/peer2.html")
    } else {
        r.send(`Your are not Authorize Peer 2 <br>Enter S.Code Here : <input type='password' placeholder='enter s...code' onchange="window.location.href = '?auth=' + this.value;">`)
    }
})

app.get('/socket.io', (q, r) => {
    r.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.min.js")
})
var count_user = 0;

io.sockets.on("connect", (o) => {

    count_user++;

    o.on("disconnect", () => {
        count_user--
        console.log();
    })

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