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

            if ( text.startsWith("#move")) {
                //#move e5
                makeMove(sender, text);
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
    sendTextMessage(sender,"Game created. \n Tell your friends to register with #id NAME and then #joinGame CODE");
}

function startGame(sender) {


    // POST Con el SENDER conseguir el CODE 
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
        
        // regresa de quien es el turno
        sendToAll(CODE, "Game is starting");
        sendToTeam(CODE, WHITE, "Your turn");
        sendToTeam(CODE, BLACK, "Blacks's turn");
        
    })
    */
    sendTextMessage(sender, "El juego ha empezado. \n Es tu turno. ");
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
        /// get sender name
    })
    */
    // when anyone joines the game
    sendToAll(code,"NAME has joined the game 43FET5H" );
    sendTextMessage(sender, "Emilio has joined the gmae 43FET5H ");

}

var timer_started = false;
// Envia a todos los jugadores del equipo de SENDER el movimiento que se hizo y cuantos han votado por ese movimiento
function makeMove(sender, text) {


    let move = text.substring(6);

    /*
    // Given a senders id, get the code of the active game and the color of the team and the movements in the current turn.
    request({
        url: '',
        method: 'POST',
        json: {
            fbid :  sender 
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }

        let myTurn = response.turn;
        let code = response.code;
        let color = response.color;
        let movements = response.movements;
        sendToTeam(code, color, movements);

        if (my_turn && !timer_started ) {
                
                timer_started = true;
                // Accept moves of 
                var start = Date.now();

                // expecting something close to 500
                setTimeout(function(){ console.log(Date.now() - start); }, 300);
                
        }
        
    })
    */
    var my_turn = true;
    if (my_turn && !timer_started ) {
        
        timer_started = true;
        // Accept moves of 
        var start = Date.now();

        // expecting something close to 500
        setTimeout(function(){ console.log(Date.now() - start);  timer_started = false; }, 10000);
        
    }

    sendTextMessage(sender, "Movimientos en el turno: \n 1. " + move + " ● ● ●\n 2. c7 ● ●" );
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




function sendToAll(code,color, text) {

    
    // POST get all players from a game room
    /*
    request({
        url: '',
        method: 'POST',
        json: {
            gamecode : code,
            color : color
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        /// Lista de jugadores de COLOR en CODE
        for(var i = 0; i < response.length; i++)
        {
            sendTextMessage(response[i], text); 
        }
    })
    */
    
}

