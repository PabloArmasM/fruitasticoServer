const express = require('express');
const otro = require('./otro');
const PORT = 3000;
const fs = require('fs');

const app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var admin = require("firebase-admin");
var serviceAccount = require("./fruitastico-6db6e-firebase-adminsdk-tyf3d-2e7b807e64.json");

const functions = require('firebase-functions');



/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fruitastico-6db6e.firebaseio.com"
});*/

admin.initializeApp(
  {credential: admin.credential.cert(serviceAccount)}
);

let db = admin.firestore();


function readDataFromJSONFile(){
  return fs.readFileSync('./data/fruit.json');
}

//HTTP server
app.post('/getFruitCollection', function(req, res){
  //res.send(readDataFromJSONFile());
  var requestObject = JSON.parse(Object.keys(req.body)[0]);
  db.collection(requestObject.collection).get()
  .then(snap => {
    var JSONdata = {};
    for (var i = 0; i < snap.size; i++) {
      JSONdata[snap.docs[i].id] = snap.docs[i].data();
    }
    res.send(JSON.stringify(JSONdata));
  })
  .catch((err) => {
    console.log('Error getting documents', err);
    res.send("A ocurrido un error a la hora de obtener los documentos");
  });
});

app.use('/source/css',express.static(__dirname +'/source/css'));


app.listen(PORT, function(){
  otro.ykc();
  console.log("Server listening on port: " + PORT);
});
