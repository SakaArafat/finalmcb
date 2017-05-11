/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/webhook", (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'myfunnelteam') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    sendMessage(event);
                }
            });
        });
        res.status(200).end();
    }
})
app.use("/test", (req, res) => {
    res.json("Hello There, this app works!");
})
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server starting on port: " + server.address().port)
})