const express = require('express');
const otro = require('./otro');
const PORT = 3000;
const fs = require('fs');
const uuid = require('uuid-random');
const nodemailer = require('nodemailer');

const app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fruitasticoapp@gmail.com',
    pass: 'fruitastico1'
  }
});

function readDataFromJSONFile(file){
  return JSON.parse(fs.readFileSync('./data/'+file+'.json'));
}

function writeData(file, data){
  fs.writeFile('./data/'+file+'.json', data, 'utf8', function(err){
    console.log(err);
  });
}

//HTTP server
app.post('/getFruitCollection', function(req, res){
  var requestObject = JSON.parse(Object.keys(req.body)[0]);
  var jsonFile = readDataFromJSONFile(requestObject.collection);
  console.log(jsonFile);
  res.send(jsonFile);
});


app.post('/getSpecificElement', function(req, res){
    var requestObject = JSON.parse(Object.keys(req.body)[0]);
    var requestObject = JSON.parse(Object.keys(req.body)[0]);
    var jsonFile = readDataFromJSONFile(requestObject.collection);
    res.send(jsonFile[requestObject._id]);
});


app.post('/setNewUser', async function(req, res){
  var requestObject = JSON.parse(Object.keys(req.body)[0]);
  fs.stat('./data/'+requestObject.collection+'.json', function(err, stats) {
    if(stats != undefined){
      console.log(true);
      var jsonResult = readDataFromJSONFile(requestObject.collection);
      console.log(jsonResult);
      jsonResult[requestObject._id] = requestObject.data;
      console.log(jsonResult);
      writeData(requestObject.collection, JSON.stringify(jsonResult));
    }else{
      console.log(false);
      var data = {};
      data[requestObject._id] = requestObject.data;
      writeData(requestObject.collection, JSON.stringify(data));
    }
  });
});

app.post('/setOrders', function(req, res){
  var requestObject = JSON.parse(Object.keys(req.body)[0]);
  fs.stat('./data/'+requestObject.collection+'.json', function(err, stats) {
    var orderId = uuid()
    if(stats != undefined){
      console.log(true);
      var jsonResult = readDataFromJSONFile(requestObject.collection);
      console.log(jsonResult);
      jsonResult[requestObject._id][orderId] = requestObject.data;
      writeData(requestObject.collection, JSON.stringify(jsonResult));
    }else{
      console.log(false);
      var firstPart ={};
      var data = {};
      firstPart[orderId] = requestObject.data;
      data[requestObject._id] = firstPart;
      writeData(requestObject.collection, JSON.stringify(data));
    }
    var mailOptions = {
      from: 'fruitasticoapp@gmail.com',
      to: requestObject.email,
      subject: 'Pedido realizado con éxito',
      text: 'El pedido '+ idOrder+' se ha realizado con exito'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
});




app.listen(PORT, function(){
  otro.ykc();
  console.log("Server listening on port: " + PORT);
});
