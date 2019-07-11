import express from "express";
import path from "path";
import expressWs from "express-ws";
import onoff from "onoff";
//var Gpio = require('onoff').Gpio;
let Gpio = onoff.Gpio;
let LED = new Gpio(4, "out");
//let app = express();

var expressWs2 = expressWs(express());
var app = expressWs2.app;

var lightvalue = LED.readSync();

app.get("/", function(req, res) {
  res.sendFile(path.resolve() + "/index.html");
});

app.get("/status", (request, response) => {
  response.send({ info: "hey dude!" });
});

app.ws("/", function(ws, req) {
  ws.send(lightvalue);
  ws.on("message", function(newLightvalue) {
    if (newLightvalue == "true") {
      lightvalue = 1;
      LED.writeSync(1);
    } else {
      lightvalue = 0;
      LED.writeSync(0);
    }
    aWss.clients.forEach(function(client) {
      client.send(lightvalue);
    });
  });
});

var aWss = expressWs2.getWss("/");

var server = app.listen(3000, function() {});
