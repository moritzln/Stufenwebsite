"use strict";
var http = require("http");
var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");
var jsonfile = require("jsonfile");
var store_file = "./db/store.json";
var repl = require("repl");
try{
    global.Student = require("./modules/students.js");
    global.store = require("./modules/database.js");
    global.Tournament = require("./modules/tournaments.js");
    if(global.store.tournament == undefined){
        global.store.tournament = new Tournament({title: "Sportfest", certificateTEX: "certificate.tex"});
    }else{
        global.store.tournament = new Tournament(global.store.tournament);
    }
}catch(e){
    console.log(e);
    if(store == undefined){
        console.log("This is a fatal error! Store is undefined!")
        process.exit();
    }
}
var control = require("./modules/control.js");


function startServer(){
    var rs = repl.start({prompt: "Control>"});
    rs.context.control = control;
    //STARTS WEBSOCKET-SERVER
    var server = http.createServer(function (req, res) {
    });
    var webSocketsServerPort = 1998;
    server.listen(webSocketsServerPort, function() {
        console.log("Server is listening on port " + webSocketsServerPort);
    });
    var wss = new webSocketServer({
        httpServer: server
    });

    global.connections = [];
    wss.on('request', function(request) {
        //Accept request
        var ws = request.accept(null, request.origin);
        ws.conId = global.connections.push(ws);

        ws.on('close', function() {
            global.connections[ws.conId] = undefined;       //!!!!!!!!!!!!!!!!!!!!!!!!!!!!! BAD SOLUTION (array will somewhen be too large)
            clearInterval(ws.interval);
        });
        //Message received
        ws.on('message', function(message) {                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!! NOT FINISHED YET
            try{
                var msg = JSON.parse(message.utf8Data);
                console.log(msg);
            }catch(e){
                console.log("A message through the websocket almost killed the server! Message: ");
                console.log(message);
                console.log("Error: ");
                console.log(e);
                ws.sendUTF(JSON.stringify({type: "notification", text: "The last message through the websocket almost killed the server. Please take a look at the console.", importance: 2}));
            }
        });
    });
}

startServer();