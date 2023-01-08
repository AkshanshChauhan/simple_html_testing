const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const e = require("express");
const port = process.env.PORT || 1000;
let app = express();

app.use(express.urlencoded())

function gtTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);

    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);

    // YYYY-MM-DD hh:mm:ss
    const formatted = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return formatted;
}

var faq = {
    q: [
        "hello",
        "who develop you",
        "who create you",
        "who make you",
        "what is this",
        "how many people connected at one time",
        "location area coordinates",
        "mobile number",
        "time"
    ],
    a: [
        "hi, how can i help you?",
        "Akshansh Chauhan Develop Me",
        "I am Created by Akshansh Chauhan",
        "I am build by Akshansh Chauhan",
        "This site is for Communication, Through Video and Audio",
        "Mainly Two, as peer1 and peer2. But you can make Several Peer1 and Peer2 at a same time",
        "Uttarakhand, India",
        "+91 ******5377, :)",
        gtTime()
    ]
}

// const options = {
//     key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem'))
// }

let server = http.createServer(app).listen(port, () => {
    console.log("Express Server listening on port " + port)
});

let io = new Server(server);

app.use(express.static("material"));

app.get('/', (q, r) => {
    r.sendFile(__dirname + "/home/index.html");
})

app.post('/faq', (q, r) => {
    if (faq.q.includes(q.body.quest)) {
        r.send(faq.a[faq.q.indexOf(q.body.quest)])
    } else {
        r.send("I don's Understand You :(")
        fs.appendFileSync("faq.txt", "question [" + gtTime() + "] : " + q.body.quest + "\n", "utf-8")
    }
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