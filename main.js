/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const watson = require("watson-developer-cloud/conversation/v1")
const app = express();
var contexts = [];
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
app.get("/test", (req, res) => {
    res.json("Hello There, this app works!");
});

function sendMessage(event) {
    let sender = event.sender.id;
    console.log("The sender id is: " + sender);
    let message = event.message.text;
    let context = null;
    let contextIndex = 0;
    let index = 0;
    contexts.forEach((value) => {
        console.log(value.from)
        if (value.from == sender) {
            context = value.context;
            contextIndex = index;
        }
        index++;
    });
    console.log("Received message from " + sender + " saying '" + message + "'");
    var conversation = new watson({
        username: "bdce6430-3faa-4ee8-a5db-8cb521efd395",
        password: "te7tJKBhISig",
        version_date: watson.VERSION_DATE_2017_04_21
    });
    console.log(JSON.stringify(context));
    console.log(contexts.length);
    conversation.message({
        input: {
            text: message
        },
        workspace_id: "cb34787f-638d-40d8-99bf-4ddbfa893732",
        context: context,
    }, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response.output.text[0]);
            if (!context) {
                contexts.push({
                    "from": sender,
                    "context": response.context
                })
            } else {
                contexts[contextIndex].context = response.context;
            }
            var intent = response.intents[0].intent;
            console.log(intent);
            if (intent == 'done') {
                contexts.splice(contextIndex, 1);
            }
            request({
                url: "https://graph.facebook.com/v2.6/me/messages",
                qs: {
                    access_token: "EAAGI5aLQ0WMBAPaldrDxXPn52wWZA7ZAWAyPqvWg5xCF6ZCXa9OivmRxPP2hZBDXnxHiR0dvaVWRIymLWT9Tf7q9dDXfFWk0MdekoNVZCITSHNgXKzPHJe3tmY1RGIjLuGyVWQCLEZATSHUoCRp4TX3WIcOSJxKMhaGhB1VtgD8QZDZD"
                },
                method: "POST",
                json: {
                    recipient: {
                        id: sender
                    },
                    message: {
                        text: response.output.text[0]
                    }
                }
            }, (error, response) => {
                if (error) {
                    console.log("Error sending message", error);
                } else if (response.body.error) {
                    console.log("Error: ", response.body.error);
                }
            });
        }
    });
}
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server starting on port: " + server.address().port)
});
// access_token: "EAAEhpuUYLXkBAKatG6W5vF04vNwDMUBMOrXIbeNTVOMTRZBaj9ZCXDoQDxZBiKVuywKrGlfQUlJstO2YRqrarE6Tqr3ZCXmkOTUZAfflK5i2ccJ7wFaSaMTr7AJw0ersvUPo3Q09HhqVuM0NNbdmxcSirQH7Fv3oe5bTTdem5VgZDZD"