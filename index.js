const express = require('express');
const otro = require('./otro');
const PORT = 3000;

const app = express();


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



//HTTP server
app.get('/getFruitCollection', function(req, res){
  db.collection('fruit').get()
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
