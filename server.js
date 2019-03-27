// imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var request = require('request');



// inicializamos la conexion con firebase
// necesitamos json con las credenciales 
var admin = require('firebase-admin');
var serviceAccount = require('./dbfirebase.json');
admin.initializeApp({

    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://telegram-44928.firebaseio.com'

});

var db = admin.database();
var ref = db.ref();


var API_KEY = "API_KEY";



function listenForNotificationRequests() {
  var requests = ref.child('usuarios');


  requests.on('child_added', function(requestSnapshot) {
    var request = requestSnapshot.val();

    sendNotificationToUser(
      request.usuario, 
      request.token, 
   
      function() {
        requestSnapshot.ref.remove();
      }
   );
  }, function(error) {
    console.error(error);
  });
  

  

  
};

function sendNotificationToUser(usuario, token) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
      notification: {
        title: "tienes un nuevo mensaje",
        body: usuario+" te ha escrito"
      },
      to : token
    })
  
  });
}





listenForNotificationRequests();

