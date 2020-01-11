const express = require('express');
const otro = require('./otro')
const PORT = 3000;

const app = express();


var admin = require("firebase-admin");

var serviceAccount = require("./fruitastico-6db6e-firebase-adminsdk-tyf3d-2e7b807e64.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fruitastico-6db6e.firebaseio.com"
});



app.get('/', function(req, res){

});

app.use('/source/css',express.static(__dirname +'/source/css'));


app.listen(PORT, function(){
  otro.ykc();
  console.log("Server listening on port: " + PORT);
});
