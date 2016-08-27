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
                continue;
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
    sendTextMessage(sender,"Create a game with the command: #createGame or joing an existing game with #joinGame CODE");

    
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
    sendTextMessage(sender,"Game created.");
    sendTextMessage(sender,"Tell your friends to register with #id NAME and then #joinGame CODE");
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
    // when anyone joines the game
    sendToAll(code,"Emilio has joined the game 43FET5H" );
    sendTextMessage(sender, "Emilio has joined the gmae 43FET5H ");

}

function sendToAll(code, text) {

    
    // POST get all players from a game room
    /*
    request({
        url: '',
        method: 'POST',
        json: {
            gamecode : code 
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        /// get game code
        for(var i = 0; i < response.length; i++)
        {
            sendTextMessage(response[i], text); 
        }
    })
    */
    
}

