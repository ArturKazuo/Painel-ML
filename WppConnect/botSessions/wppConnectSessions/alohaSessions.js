//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

const Client = require('../components/wppConnectClient');
var express = require('express');
const fetch = require('node-fetch');
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs')
var shell = require('shelljs');

let SESSION_NAME = null;
const API_PORT = process.env.SENDERPORT || 60008; //favor não editar aqui, edite as portas no arquivo de portas
const CHATBOT_PORT = process.env.PORT || 3979;    //favor não editar aqui, edite as portas no arquivo de portas
const CALLBACK_RECEIVE = process.env.CALLBACK_RECEIVE || 'http://localhost';
const CALLBACK_ROUTE = process.env.CALLBACK_RECEIVE || 'api/whatsapp/messages';


// Load process.env values from .env file
require('dotenv').config();

const use_sockets = false;

//WhatsApp Server
let client = {};


async function receiveMessage(text, contact, channelData, msg) {
  console.log('REC:', JSON.stringify(msg));

  if ((text) || (msg.type == "ciphertext")) {
    const resposta = await callbackReceive(msg);
    return false;
  } else {
    return;
  }
};

async function callbackReceive(mensagem) {
  if (CALLBACK_RECEIVE) {
    try {
      const urlApi = `${CALLBACK_RECEIVE}:${CHATBOT_PORT}/${CALLBACK_ROUTE}`;
      console.log('urlApi:', JSON.stringify(urlApi));
      const response = await fetch(urlApi, {
        method: 'post',
        body: JSON.stringify(mensagem),
        headers: {'Content-Type': 'application/json'}
      });
      const data = await response.json();
      //console.log(data);
      return data;
      
    } catch (error) {
      return {error: error}
      
    }
  }

}



function sendText(phone, text, qrcode) {
  if (!text) return;
  

  return new Promise((resolve, reject) => {

    if (!client) reject(new Error(`No Client`));

    console.log(`>> Enviando ${phone} ${text}`);
    client.sendTextNew(phone, text, qrcode).then((res) => {
      resolve(res);
    }).catch((error) => {
      console.log(`[ERROR] ${JSON.stringify(error)}`);
      reject(error)
    })

  });
}



var app = express();

app.listen(API_PORT, function () {
  console.log(`WhatsAppSession listening on port ${API_PORT}!`);
});


app.get('/send', async function (req, res) {
  function formatPhoneNumber(phoneNumberString) {
    var numberPattern = /\d+/g;
    var match = phoneNumberString.match(numberPattern);
    return `${match}`;
  }

  const telefone = formatPhoneNumber(req.query.phone).replace(/\,/g, '');

  let phone = null;
  phone = `${telefone}@c.us`;

  res.header('Content-Type', 'application/json');
  if (phone) {
    let text = req.query.text;
    let qrcode = req.query.qrcode;

    try {
      await sendText(phone, text, qrcode);
      res.send({ status: 'ok', code: 0 });
    } catch (error) {
      res.statusCode = 403;
      res.send({ ...error, code: 1 });
    }

  } else {
    res.statusCode = 403;
    res.send({
      "numberExists": false,
      "connection": "CONNECTED",
      "code": 1
    });
  }

});

app.get('/getNumber', async function (req, res) {
  function formatPhoneNumber(phoneNumberString) {
    var numberPattern = /\d+/g;
    var match = phoneNumberString.match(numberPattern);
    return `${match}`;
  }

  const telefone = formatPhoneNumber(req.query.phone).replace(/\,/g, '');

  let phone = null;
  phone = `${telefone}@c.us`;

  res.header('Content-Type', 'application/json');
  if (phone) {
    try {
      const resposta = await client.getPhoneNumber(phone);
      res.send(resposta);
    } catch (error) {
      res.statusCode = 403;
      res.send({ ...error, code: 1 });
    }

  } else {
    res.statusCode = 403;
    res.send({
      "numberExists": false,
      "connection": "CONNECTED",
      "code": 1
    });
  }

});

app.get('/generateQRCode', async function (req, res) {

  console.log("resques: ", req.query)

  let id = req.query.id

  SESSION_NAME = id

  client = new Client(SESSION_NAME, receiveMessage, id)

  // let qrCode = await generateQRCode(req.query)

  res.json(
      {
          result: "ok",
          error: null
      }
  )

  // res.end()

});


app.get('/getImage', async function (req, res) {

  let pic = req.query.image;

  fs.readFile(`${__dirname}/qrCodes/` + pic + ".png", async function (err, content) {
      if (err) {
          res.writeHead(400, {'Content-type':'image/png'})
          // console.log(err);
          let errorImage = fs.readFileSync(`${__dirname}/imgs/errorFF.jpg`)
          res.end(errorImage);    
      } else {
          //specify the content type in the response will be an image
          res.writeHead(200,{'Content-type':'image/png'});
          res.end(content);
      }
  });

})

app.get('/stopSession', async function (req, res) {

  // shell.exec(`${__dirname}/botSessions/${req.query.session}`)
  shell.exit(1)

})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json(), cors({
  origin: 'http://localhost:3000'
}))

