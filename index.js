'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'test_token') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {

        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender)
                continue
            }

            if ( text.startsWith("#id"))  {
                register(sender, text);
                continue;
            }

            if ( text.startsWith("#createGame") ) {
                createGame(sender);
                continue;
            }

            if ( text.startsWith("#joinGame")) {
                joinGame(sender, text);
            }
           sendTextMessage(sender, JSON.stringify(req.body)); 
           //sendTextMessage(sender, "Text fsidjfisdjfiasj, echo: " + text.substring(0, 200))
        }
	if (event.postback) {
           let text = JSON.stringify(event.postback)
           sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
           continue
     	}
    }
    res.sendStatus(200)
})
               
const token = "EAAMpzX8aZB0cBAKVPfzc1LAY78JZBlGUL0uHoh5ZB63f5ISDYdPGnvgPsXW7EJkntw2ZAbFYWswrOiV5sUXsL7PXxUZB1WUXgEZCTNwdC3pozjMTgSZB2IeL8rJ4R0GtmfsqZBAEJTcReLK5Ajusm5sb4eKu0ZBC1iEYVuqqt5mvPmAZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function register(sender, text) {
    //#id emilio
    
    // POST A Server Daniel

    // remove the #id from the messege
    let name = text.substring(4);
    sendTextMessage(sender,"Registered as: " + name);
    sendTextMessage(sender,"Create a game with the command: #createGame");
    
    /*
    request({
        url: '',
        method: 'POST',
        json: {
            recipient: name,
            fbid :  sender 
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    */
}


function createGame(sender) {

    
    // POST A Server Daniel de create game
    /*
    request({
        url: '',
        method: 'POST',
        json: {
            recipient: name,
            fbid :  sender 
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        /// get game code
    })
    */
    sendTextMessage(sender,"Game created. Share this code with your friends 43FET5H");
}

function joinGame(sender, text) {
    // remove the #joinGame
    let code = text.substring(10);

    // POST A Server Daniel de joinGame
    /*
    request({
        url: '',
        method: 'POST',
        json: {
            fbid :  sender,
            gamecode : code 
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        /// get game code
    })
    */
    sendTextMessage(sender,"Joined game 43FET5H as Emilio " );


}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
